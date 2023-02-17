const { audition, audition_images, audition_links, audition_video } = require('../../Model/audition');
const auditionSchema = require('../../Schema/auditionSchema');
const fs= require('fs');
const ip = process.env.IP;
const basepath=process.env.BASEPATH;

const AddAudition = async (req, res) => {
    const { error, value } = auditionSchema.validate(req.body);
    if (error) {
        return res.status(422).send(error.details)
    }
    //Add data
    const auditionData = await audition.create(value);
    const id = auditionData.id;
    if (req.files) {
        var files = [];
        if (req.files.images) {
            req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
            req.files.images.forEach(file => {
                files.push({ tblAuditionId: id, filename: file.name, location: `Assets/Audition/${id}/images/${file.name}` });
                file.mv(`Assets/Audition/${id}/images/${file.name}`);
            });
            audition_images.bulkCreate(files);
        }
        files = [];
        if (req.files.videos) {
            req.files.videos.length == undefined && (req.files.videos = [{ ...req.files.videos }]);
            req.files.videos.forEach(file => {
                files.push({ tblAuditionId: id, filename: file.name, location: `Assets/Audition/${id}/videos/${file.name}` });
                file.mv(`Assets/Audition/${id}/videos/${file.name}`);
            });
            audition_video.bulkCreate(files);
        }
    }
    var links = []
    value.links.forEach(link => {
        if (link) {
            links.push({ tblAuditionId: id, audition_links: link });
        }
    });
    audition_links.bulkCreate(links);

    res.send("Data submitted successfully")
}

const ViewAudition = async (req, res) => {
    const Auditiondata = await audition.findAll(
        {
            include: [
                { model: audition_images, as: 'images', attributes: ['id', 'filename', ['location', 'image_url']] },
                { model: audition_video, as: 'videos', attributes: ['id', 'filename', ['location', 'video_url']] },
                { model: audition_links, as: 'links', attributes: ['id', 'audition_links'] },
            ], attributes: ['id', 'name', 'mobile_no', 'email_id', 'description']
        });
    if (Auditiondata.length != 0) {
        for (data of Auditiondata) {
            for (img of data.images) {
                img.dataValues.image_url = ip + img.dataValues.image_url;
            }
            for (video of data.videos) {
                video.dataValues.video_url = ip + video.dataValues.video_url;
            }
        }
        res.send(Auditiondata);
    } else {
        res.status(404).json({ details: "Data not found" })
    }
}

const ViewSPecificAudition = async (req, res) => {
    const id = req.params.id;
    const Auditiondata = await audition.findByPk(id,
        {
            include: [
                { model: audition_images, as: 'images', attributes: ['id', 'filename', ['location', 'image_url']] },
                { model: audition_video, as: 'videos', attributes: ['id', 'filename', ['location', 'video_url']] },
                { model: audition_links, as: 'links', attributes: ['id', 'audition_links'] },
            ], attributes: ['id', 'name', 'mobile_no', 'email_id', 'description']
        }
    );

    if (Auditiondata) {
        for (img of Auditiondata.images) {
            img.dataValues.image_url = ip + img.dataValues.image_url;
        }
        for (video of Auditiondata.videos) {
            video.dataValues.video_url = ip + video.dataValues.video_url;
        }

        res.send(Auditiondata);
    } else {
        res.status(404).json({ details: "Data not found" })
    }

}

const EditAudition = async (req, res) => {
    const value = req.body;
    const id = req.params.id;
    const Auditiondata = await audition.findByPk(id);
    if (Auditiondata) {
        audition.update(value, { where: { id: id } });

        //upload images:
        if (req.files) {
            var files = [];
            if (req.files.images) {
                req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
                req.files.images.forEach(file => {
                    files.push({ tblAuditionId: id, filename: file.name, location: `Assets/Audition/${id}/images/${file.name}` });
                    file.mv(`Assets/Audition/${id}/images/${file.name}`);
                });
                audition_images.bulkCreate(files);
            }
            files = [];
            if (req.files.videos) {
                req.files.videos.length == undefined && (req.files.videos = [{ ...req.files.videos }]);
                req.files.videos.forEach(file => {
                    files.push({ tblAuditionId: id, filename: file.name, location: `Assets/Audition/${id}/videos/${file.name}` });
                    file.mv(`Assets/Audition/${id}/videos/${file.name}`);
                });
                audition_video.bulkCreate(files);
            }
        }
        if (value.links) {
            var links = []
            value.links.forEach(link => {
                if (link) {
                    links.push({ tblAuditionId: id, audition_links: link });
                }
            });
            audition_links.bulkCreate(links);
        }

        res.send("Data updated successfully");
    } else {
        res.status(404).json({ detail: "Data not found" });
    }
}

const DeleteAudition =async (req, res) => {
    const id= req.params.id;
    const Auditiondata = await audition.findByPk(id);
    if (Auditiondata) {
        try{
            fs.rmSync(`${basepath}Assets/Audition/${id}`,{recursive:true,force:true});
        }catch(err){
            console.log("can't delete files",err);
        }
        audition.destroy({where:{id:id}});
        res.send("Data and files are deleted")
    }else{
        res.status(404).json({detail:"Data not found"})
    }
    
}

const DeleteAuditionImage =async (req, res) => {
    const id= req.params.id;
    const image= await audition_images.findByPk(id);
    if(image){
        try{
            fs.rmSync(basepath+image.location,{recursive:true,force:true});
        }catch(err){
            console.log("can't delete files",err);
        }
        audition_images.destroy({where:{id:id}})
        res.send("Image deleted")
    }else{
        res.status(404).json({detail:"Data not found"});
    }

}

const DeleteAuditionVideo = async(req, res) => {
    const id= req.params.id;
    const video= await audition_video.findByPk(id);
    if(video){
        try{
            fs.rmSync(basepath+video.location,{recursive:true,force:true});
        }catch(err){
            console.log("can't delete files",err);
        }
        audition_video.destroy({where:{id:id}})
        res.send("video deleted")
    }else{
        res.status(404).json({detail:"Data not found"});
    }
}

const DeleteAuditionLink =async (req, res) => {
    const id= req.params.id;
    const links= await audition_links.findByPk(id);
    if(links){
        try{
            fs.rmSync(basepath+links.location,{recursive:true,force:true});
        }catch(err){
            console.log("can't delete files",err);
        }
        audition_links.destroy({where:{id:id}})
        res.send("Link deleted")
    }else{
        res.status(404).json({detail:"Data not found"});
    }

}


module.exports = { AddAudition, ViewAudition, EditAudition, DeleteAudition, DeleteAuditionImage, DeleteAuditionLink, DeleteAuditionVideo, ViewSPecificAudition }