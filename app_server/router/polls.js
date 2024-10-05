import { CreatePoll, getPoll, castVote, getPolls} from "../controllers/pollsController.js";
import Express from "express"
const router = Express.Router()

router.post('/addpoll', CreatePoll);

router.post('/addvote', castVote);

router.post('/getpoll', getPoll);

router.get('/getpolls', getPolls);
export default router;