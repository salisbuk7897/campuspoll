import { AddUser, LoginUser, handleLogin } from "../controllers/usersController.js";
import Express from "express"
const router = Express.Router()

router.post('/adduser', AddUser);

router.post('/login', LoginUser); 

router.get('/login', handleLogin);

router.get('/check', function(req, res, next) {
  var rr = "";
  try{
    if(!req.cookies.cpoll_jwt){
      rr = false;
    }else{
      rr = `${req.cookies.cpoll_jwt}`;
    }
  }catch(e){
    rr = false;
  }
  res.send(rr);
});

router.get('/logout', function(req, res, next) {
  try{
    return res
    .clearCookie('cpoll_jwt')
    .send("success")
  }catch(e){
    return res
      .send("failed")
  }
  
});

router.get('/', function(req, res, next) {
    res.send('hello', { title: 'Express' });
  });

export default router;