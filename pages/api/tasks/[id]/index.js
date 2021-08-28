import nc from "next-connect";
import db from '../../../../utils/db';
import Task from '../../../../models/Task';

const handler = nc();

handler.delete(async (req, res) => {
  const { id } = req.query;
  await db.connect();
  console.log("id: ", id);
  const taskToDelete = await Task.findById(id);
  console.log("taskToDelete: ", taskToDelete);
  await taskToDelete.remove();
  await db.disconnect();
  res.status(200).send({ message: 'Task deleted successfully' });
});

export default handler;
