#!/bin/bash

# Menjalankan backend-server
./backend-server &

# Menjalankan mqtt-server
./mqtt-server &

# Tunggu semua proses selesai
wait
