   ### Message Schema

   | Field          | Type                   | Required | Constraints         | Default     | Description                                      |
   |----------------|------------------------|----------|---------------------|-------------|--------------------------------------------------|
   | `message.text` | String                 | Yes      | –                   | –           | The content of the message                       |
   | `users`        | [String]               | No       | –                   | –           | List of user identifiers involved in the message |
   | `sender`       | ObjectId (ref: Users)  | Yes      | References `Users`  | –           | User who sent the message                        |
   | `time`         | String                 | Yes      | –                   | –           | Custom time string (e.g., HH:MM format)          |
   | `createdAt`    | Date                   | No       | Auto by Mongoose    | `timestamp` | Timestamp when the message was created           |
   | `updatedAt`    | Date                   | No       | Auto by Mongoose    | `timestamp` | Timestamp when the message was last updated      |
   