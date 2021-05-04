This is a web-based Task Manager app. It allows you to add tasks with attachments to a list, and update them. You can add extra information to the tasks, mark them as complete, and add a scheduled date. If you want, you can also delete tasks when you're done with them. You can also assign a task to another app user.

User also able to  send message to another user for specific task with attachment.

Used Cloudinary for attachments and Firbase FCM for push notification.

The tasks which you add and the updates which you make to them are stored in a MongoDB database, which means that everything you do is saved - i.e. changes you make in one session will be visible in the next session.

The Node.js backend uses Express.js, Model Sequelize(ORM) and routes requests from the client to the database also hosted on Heroku. Data is fetched, added, updated and deleted using  Model Sequelize(ORM) and alse used JWT for authorization.
