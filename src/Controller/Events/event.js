const eventSchema = require('../../Schema/eventSchema');
const { Events, Event_images } = require('../../Model/events');
const fs=require('fs');

const ip = process.env.IP;
const basePath=process.env.BASEPATH;

const AddEvents = async (req, res) => {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
        return res.status(422).send(error.details)
    }
    const Eventdata = await Events.create(value);
    if (req.files) {
        var imagefile = [];
        req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
        req.files.images.forEach(file => {
            try {
                file.mv(`Assets/Events/${Eventdata.id}/${file.name}`);
                Event_images.create({ filename: file.name, location: `Assets/Events/${Eventdata.id}/${file.name}`, tblEventId: Eventdata.id });
            } catch {
                console.log("Can't save image");
            }
        });
    }

    res.send(value)
}

const ViewEvents = async (req, res) => {
    const data = await Events.findAll({
        attributes: ['id','event_name', 'description', "start_date", "start_time", "end_date", "end_time", "event_type", "location", "email_id", "mobile_no", "event_status", "booking_status", "ticket_price", "ticket_count", "live_link"], include: [
            { model: Event_images, as: 'images', attributes: ['filename', ['location', 'image_link']] }
        ]
    });

    if (data.length != 0) {
        for (let item of data) {
            for (let img of item.images) {
                img.dataValues.image_link = ip + img.dataValues.image_link;
            }
        }
        res.send(data);
    } else {
        res.status(404).send("Data not found");
    }
}

const ViewEventsByID = async (req, res) => {
    const data = await Events.findByPk(req.params.id, {
        attributes: ['id','event_name', 'description', "start_date", "start_time", "end_date", "end_time", "event_type", "location", "email_id", "mobile_no", "event_status", "booking_status", "ticket_price", "ticket_count", "live_link"], include: [
            { model: Event_images, as: 'images', attributes: ['filename', ['location', 'image_link']] }
        ]
    });
    if (data) {
        for (let img of data.images) {
            img.dataValues.image_link = ip + img.dataValues.image_link;
        }

        res.send(data);
    } else {
        res.status(404).send("Data not found");
    }
}

const EditEvents = async (req, res) => {
    const id = req.params.id;

    const data = await Events.update(req.body, { where: { id: id }, returning: true, raw: true });
    if (data[0] == 1) {

        const eventId = data[1][0].id;

        if (req.files) {
            var imagefile = [];
            req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
            req.files.images.forEach(file => {
                try {
                    file.mv(`Assets/Events/${eventId}/${file.name}`);
                    Event_images.create({ filename: file.name, location: `Assets/Events/${eventId}/${file.name}`, tblEventId:eventId });
                } catch {
                    console.log("Can't save image");
                }
            });
        }

        res.send("Data updated successfully")
    } else {
        res.send("Can't update data")
    }
}

const DeleteEvents =async (req, res) => {
    const id= req.params.id;
    const data=await Events.destroy({where:{id:id}});
    console.log(data);
    if(data !=0){
        fs.rmSync(`${basePath}Assets/Events/${id}`,{force:true,recursive:true});
        res.send("Event deleted successfully")
    }else{
        res.status(404).send("Data not found")
    }
}

const DeleteEventImage= async (req,res)=>{
    const id= req.params.id;
    const data= await Event_images.findByPk(id);
    if(data){
        fs.rmSync(basePath+data.location,{force:true,recursive:true});
        Event_images.destroy({where:{id:id}});

        res.send("Deleted successfully");
    }else{
        res.send("Image file not found");
    }
}

module.exports = { AddEvents, EditEvents, ViewEvents, DeleteEvents, ViewEventsByID, DeleteEventImage }