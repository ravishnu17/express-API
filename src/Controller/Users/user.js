const { user } = require('../../Model/user');
const bcrypt= require('bcryptjs');
const {generateToken}=require('../../Auth/auth')

const viewUser =async (req, res) => {
    const userData=await user.findByPk(req.tokenData.id,{attributes:['first_name','email_id','mobile_no']});
    if(userData){
        res.send(userData);
    }else{
        res.status(404).json({detail:"User not found"});
    }
}

const addUser = async (req, res) => {
    const checkUser = await user.findOne({ where: { email_id: req.body.email_id } });
    if (!checkUser) {
        req.body.password=await bcrypt.hash(req.body.password,10);
        const newData= await user.create(req.body);
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
    const {email_id,password}= req.body;
    
    const data= await user.findOne({where:{email_id:email_id }});
    if(data){
        if(await bcrypt.compare(password,data.password)){
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