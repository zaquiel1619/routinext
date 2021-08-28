import nc from "next-connect";
import db from '../../../utils/db';
import HistoryTask from '../../../models/HistoryTask';

const handler = nc();



handler.post(async (req, res) => {
  const { idHistoryTask, tasks } = req.body;
  await db.connect();
  const historyToday = await HistoryTask.findById(idHistoryTask);
  historyToday.tasks = tasks;
  historyToday.save(function (err) {
    if (err) res.status(500).send({ message: 'Error updating history task'});
    else {
      res.status(200).send({message: 'History task updated successfully'});
    };
  })
  await db.disconnect();
});

export default handler;
