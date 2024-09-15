# iotunnel

## Postgres

---

-   Update and Install Postgres

```bash
sudo apt-get update
sudo apt-get install postgresql
```

-   Check Postgres Version

```bash
psql --version
```

-   Initialize Postgres (Change the version number to your current version)

```bash
sudo pg_ctlcluster 16 main start
```

-   Create User and Database

```bash
sudo -u postgres psql -c "CREATE USER iotunnel WITH PASSWORD 'YOUR_DATABASE_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE IoTunnel OWNER iotunnel;"
```

-   Grant All Privileges to User

```bash
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE IoTunnel TO iotunnel;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO iotunnel;"
```
