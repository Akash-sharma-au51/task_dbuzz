1)**How do you scale a MERN application?**

When a MERN app starts getting more users, I first try to figure out where the bottleneck is.

If the database becomes slow, I optimize MongoDB queries by adding indexes. For frequently requested data, I’d use Redis caching so we don’t hit the database every time. If the app grows a lot, MongoDB sharding can help distribute data across multiple servers.

For the backend, since Node.js runs on a single thread, I’d run multiple instances using PM2 or Docker and use a load balancer like Nginx to distribute traffic.

For heavy tasks like sending emails or processing files, I wouldn’t do that inside the request-response cycle. I’d move those tasks to background jobs using tools like Bull or RabbitMQ.

On the frontend side, I’d optimize React using lazy loading, code splitting, and CDN delivery for static files.

So overall, my approach is: optimize first, then scale infrastructure when needed.


2) What are the pros and cons of MongoDB?
Pros:

One thing I like about MongoDB is its flexible schema. We don’t need to define strict tables like SQL databases, which makes development faster when requirements change often.

It also scales well because it supports sharding.

MongoDB works really well with JavaScript applications because data is stored in JSON-like format, which feels natural in MERN apps.

It also performs well for read-heavy applications when indexing is properly used.

Cons:

MongoDB isn’t always the best choice when you have complex relationships between data.

In SQL, joins are easier, but in MongoDB managing relationships can get tricky.

For applications like banking systems where strict transactions and consistency are critical, SQL databases are usually better.

Also, if schema validation isn’t handled properly, data can become messy over time.


3) Fix the following code and explain the issue

app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user.name);
});

corrected version: 
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user.name);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

Problem:
It doesn’t handle errors.

Invalid ID → app may crash
User not found → undefined error
Database issue → server failure

4) How does React rendering work when state updates?

When state changes in React using something like setState or useState, React re-renders that component.

It creates a new virtual DOM and compares it with the previous one using reconciliation.

Then React updates only the changed part in the real DOM instead of reloading everything.

ex: 
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}


5) Display JSON data in a React table

const users = [
  { id: 1, name: "Amit", email: "amit@example.com" },
  { id: 2, name: "Sara", email: "sara@example.com" }
];

function TableData() {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableData;

6) Difference between PUT and PATCH

PUT is used when you want to update the entire data
ex:{
  "name": "Akash",
  "email": "akash@gmail.com"
}
when we are using put req, we have send entire data

PATCH is used when you want to update specific data
ex:{
  "name": "Akash"
  }
when we are using patch req, we have send only specific data
