# iotunnel

## Postgres

---

-   Update and Install Postgres

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

-   Start Postgres

```bash
sudo systemctl start postgresql
```

-   Create User and Database

```bash
sudo -u postgres psql -c "CREATE USER iotunnel WITH PASSWORD 'YOUR_DATABASE_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE iotunnel_db OWNER iotunnel;"
```

-   Grant All Privileges to User

```bash
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE iotunnel_db TO iotunnel;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO iotunnel;"
```
