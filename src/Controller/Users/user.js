const { user } = require('../../Model/user');
const bcrypt= require('bcryptjs');
const {generateToken}=require('../../Auth/auth');
const {userSchema,loginSchema}=require('../../Schema/usersSchema')

const viewUser =async (req, res) => {
    const userData=await user.findByPk(req.tokenData.id,{attributes:['first_name','email_id','mobile_no']});
    if(userData){
        res.send(userData);
    }else{
        res.status(404).json({detail:"User not found"});
    }
}

const addUser = async (req, res) => {
    const {error, value}= userSchema.validate(req.body);
    if(error){
        return res.send(error.details[0].message);
    }
    const checkUser = await user.findOne({ where: { email_id: value.email_id } });
    if (!checkUser) {
        value.password=await bcrypt.hash(value.password,10);
        const newData= await user.create(value);
        res.send(newData);
    }else{
    res.send("Already registered with this email ID");
    }
}

const deleteUser =async (req, res) => {
    const userData=await user.findByPk(req.tokenData.id);
    if(userData){
        user.destroy({where:{id:req.tokenData.id}});
        res.send("User Removed");
    }else{
        res.status(404).json({detail:"User not found"});
    }
}

const login=async (req,res)=>{
    const {error, value}=loginSchema.validate(req.body);
    if(error){
        return res.send(error.details[0].message)
    }
    
    const data= await user.findOne({where:{email_id:value.username }});
    if(data){
        if(await bcrypt.compare(value.password,data.password)){
            token= generateToken({id:data.id,name:data.first_name});
            res.send({"access_token":token,"token_type":"bearer","user":data.name})
        }else{
            res.status(403).send("Invalid credentials")
        }
    }else{
        res.status(404).send("Invalid credentials");
    }
}

module.exports = { viewUser, addUser, deleteUser, login }