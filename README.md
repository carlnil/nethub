Lab 2 for DD1368 Database Technology at KTH Royal Institute of Technology.

Follow steps below to load database.

Open a command prompt or terminal in the project server folder and login to PostgreSQL. 

Create the database.

```SQL
CREATE DATABASE nethub;
```

Then, load data.

```
\c nethub;
\i database.psql;
\i values.psql;
```

