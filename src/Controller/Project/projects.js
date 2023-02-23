const { project, projectImages, Sequelize, projectDocs } = require('../../Model/project');
const { Op } = Sequelize;

const fs = require('fs');
const projectSchema = require('../../Schema/projectSchema')
const ip = process.env.ip;
const BasePath = process.env.basepath;

const viewProjects = async (req, res) => {
    const Projectdata = await project.findAll(
        {
            include: [
                { model: projectImages, as: 'images', attributes: ['id', 'file_name', ['image_location', 'image_url']] },
                { model: projectDocs, as: 'docs', attributes: ['id', 'file_name', ['location', 'docs_url']] },
            ],
            attributes: ['id', 'project_name', 'project_goal', 'project_description', 'start_date', 'end_date', 'category', 'donation_status', 'status']
        });

    if (Projectdata.length != 0) {
        for (const data of Projectdata) {
            for (img of data.images) {
                img.dataValues.image_url = ip + img.dataValues.image_url;
            }
            for (docs of data.docs) {
                docs.dataValues.docs_url = ip + docs.dataValues.docs_url;
            }
        }
        res.send(Projectdata);
    } else {
        res.status(404).json({ detail: "Data not found" });
    }
}

const viewProjectsByID = async (req, res) => {
    const id = req.params.id;
    const Projectdata = await project.findByPk(id, {
        include: [
            { model: projectImages, as: 'images', attributes: ['id', 'file_name', ['image_location', 'image_url']] },
            { model: projectDocs, as: 'docs', attributes: ['id', 'file_name', ['location', 'docs_url']] },
        ],
        attributes: ['id', 'project_name', 'project_goal', 'project_description', 'start_date', 'end_date', 'category', 'donation_status', 'status']
    });

    if (Projectdata) {
        for (img of Projectdata.images) {
            img.dataValues.image_url = ip + img.dataValues.image_url;
        }
        for (docs of Projectdata.docs) {
            docs.dataValues.docs_url = ip + docs.dataValues.docs_url;
        }
        res.send(Projectdata);
    }
    else {
        res.status(404).json({ detail: "Data not found" });
    }
}

const viewprojectImage = async (req, res) => {
    const data = await projectImages.findByPk(req.params.id);
    if (data) {
        res.sendFile(BasePath + data.image_location);
    } else {
        res.status(404).json({ detail: "Image not found" });
    }
}

const deleteprojectImage = async (req, res) => {
    const data = await projectImages.findByPk(req.params.id);

    if (data) {
        await fs.rmSync(BasePath + data.image_location, { force: true });
        projectImages.destroy({ where: { id: req.params.id } });
        res.status(200).send({ detail: "File deleted successfully" });
    } else {
        res.status(404).json({ detail: "Image not found" });
    }
}

const viewprojectDocx = async (req, res) => {
    const data = await projectDocs.findByPk(req.params.id);
    if (data) {
        res.sendFile(BasePath + data.location);
    } else {
        res.status(404).json({ detail: "Document not found" });
    }
}

const deleteprojectDocx = async (req, res) => {
    const data = await projectDocs.findByPk(req.params.id);

    if (data) {
        await fs.rmSync(BasePath + data.location, { force: true });
        projectDocs.destroy({ where: { id: req.params.id } });
        res.status(200).send({ detail: "File deleted successfully" });
    } else {
        res.status(404).json({ detail: "Image not found" });
    }
}

const addProjects = async (req, res) => {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
        return res.send(error.details[0].message)
    }

    const newData = await project.create(value);
    const project_id = newData.id;
    var fileData = [];
    if (req.files) {
        if (req.files.images) {
            req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
            req.files.images.forEach(file => {
                const imageData = {
                    project_id: project_id,
                    file_name: file.name,
                    image_location: `Assets/projects/${project_id}/images/${file.name}`
                }
                file.mv(`Assets/projects/${project_id}/images/${file.name}`);
                fileData.push(imageData);
            });

            projectImages.bulkCreate(fileData);
        }
        fileData = [];
        if (req.files.docs) {
            req.files.docs.length == undefined && (req.files.docs = [{ ...req.files.docs }]);

            req.files.docs.forEach(file => {
                const docsData = {
                    project_id: project_id,
                    file_name: file.name,
                    location: `Assets/projects/${project_id}/docx/${file.name}`
                }
                file.mv(`Assets/projects/${project_id}/docx/${file.name}`);
                fileData.push(docsData);
            });
            projectDocs.bulkCreate(fileData);
        }
        res.json({ detail: "Data added successfully" });
    } else {
        res.send({ detail: "Data added successfully" });
    }

}

const updateProjects = async (req, res) => {
    // const { error, value } = projectSchema.validate(req.body);
    // if (error) {
    //     return res.send(error.details);
    // }
    const value= req.body;
    const project_id = req.params.id;
    const checkData = await project.findByPk(project_id);
    if (checkData) {
        const updateData = await project.update(value, { where: { id: project_id } });
        if (updateData == 1) {

            var fileData = [];
            if (req.files) {
                if (req.files.images) {
                    req.files.images.length == undefined && (req.files.images = [{ ...req.files.images }]);
                    req.files.images.forEach(file => {
                        const imageData = {
                            project_id: project_id,
                            file_name: file.name,
                            image_location: `Assets/projects/${project_id}/images/${file.name}`
                        }
                        file.mv(`Assets/projects/${project_id}/images/${file.name}`);
                        fileData.push(imageData);
                    });

                    projectImages.bulkCreate(fileData);
                }
                fileData = [];
                if (req.files.docs) {
                    req.files.docs.length == undefined && (req.files.docs = [{ ...req.files.docs }]);

                    req.files.docs.forEach(file => {
                        const docsData = {
                            project_id: project_id,
                            file_name: file.name,
                            location: `Assets/projects/${project_id}/docx/${file.name}`
                        }
                        file.mv(`Assets/projects/${project_id}/docx/${file.name}`);
                        fileData.push(docsData);
                    });
                    projectDocs.bulkCreate(fileData);
                }
                res.json({ detail: "Data added successfully" });
            } else {
                res.send({ detail: "Data added successfully" });
            }

        } else {
            res.status(409).json({ detail: "Can't update Data" });
        }
    } else {
        res.status(404).json({ detail: "Data not found" });
    }
}

const deleteProjects = async (req, res) => {
    const project_id = req.params.id;
    const checkData = await project.findByPk(project_id);
    if (checkData) {
        fs.rmSync(`${BasePath}Assets/projects/${project_id}`, { force: true, recursive: true });

        project.destroy({ where: { id: project_id } });
        res.send({ detail: "Deleted successfully" });
    } else {
        res.status(404).json({ detail: "Data not found" });
    }
    // await fs.rmSync(`${BasePath}projects/test`, { force: true });
    // res.send("Deleted successfully");
}

const searchProject = async (req, res) => {
    const searchValue = req.params.value
    var options = {
        where: {
            [Op.or]:[
                {project_name: { [Op.iLike]: `${searchValue}%` }},
                {project_description: { [Op.iLike]: `${searchValue}%` }}
            ]
        }, raw: true
    };
    const value = await project.findAll(options);

    for (const data of value) {
        const imgData = await projectImages.findAll({ where: { project_id: data.id } });
        var image_url = []
        for (const img of imgData) {
            image_url.push({ image_url: ip + img.image_location });
        }
        data.image_url = image_url;

        const docsData = await projectDocs.findAll({ where: { project_id: data.id } });
        var docs_url = []
        for (const docx of docsData) {
            docs_url.push({ docs_url: ip + docx.location });
        }
        data.docs_url = docs_url;
    }

    res.send(value);
}
module.exports = { viewProjects, addProjects, viewprojectImage, updateProjects, deleteProjects, viewProjectsByID, deleteprojectImage, searchProject, viewprojectDocx, deleteprojectDocx }