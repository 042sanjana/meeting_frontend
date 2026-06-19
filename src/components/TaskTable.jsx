function TaskTable({ tasks }) {

  return (

    <table
      border="1"
      cellPadding="10"
    >

      <thead>

        <tr>

          <th>
            Owner
          </th>

          <th>
            Task
          </th>

          <th>
            Deadline
          </th>

        </tr>

      </thead>

      <tbody>

        {
          tasks.map(
            (
              task,
              index
            ) => (

              <tr key={index}>

                <td>
                  {task.owner}
                </td>

                <td>
                  {task.task}
                </td>

                <td>
                  {task.deadline}
                </td>

              </tr>

            )
          )
        }

      </tbody>

    </table>

  );
}

export default TaskTable;