#!/bin/bash
# Postgres official image runs *.sh in /docker-entrypoint-initdb.d/ during init.
# Tujuan: bikin 3 logical database untuk hybrid microservices (DEC-019).
# Dijalankan SEKALI saat volume Postgres pertama dibuat (atau di-recreate).
#
# Variable: POSTGRES_USER dan POSTGRES_PASSWORD diambil dari env compose.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE DATABASE item_db;
    CREATE DATABASE engagement_db;
    GRANT ALL PRIVILEGES ON DATABASE auth_db TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE item_db TO "$POSTGRES_USER";
    GRANT ALL PRIVILEGES ON DATABASE engagement_db TO "$POSTGRES_USER";
EOSQL

echo "Created auth_db, item_db, engagement_db"
