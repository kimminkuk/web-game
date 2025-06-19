#!/bin/bash

port="$1"
if [ -z "$port" ]; then
    port=3000
    echo "No port specified, defaulting to port $port."
fi

#1. netstat -tuln | grep :3000
if netstat -tuln | grep -q ":$port"; then
    echo "Server is running on port $port."
else
    echo "Server is not running on port $port."
fi

#2. lsof -i :3000
if lsof -i ":$port"; then
    echo "Process using port $port:"
    lsof -i ":$port"
else
    echo "No process is using port $port."
fi

#3. ss -tuln | grep :3000
if ss -tuln | grep -q ":$port"; then
    echo "Server is listening on port $port."
else
    echo "No server is listening on port $port."
fi

#4. fuser 3000/tcp
if fuser "$port"/tcp; then
    echo "Port $port is in use."
else
    echo "Port $port is not in use."
fi

#5. ps aux | grep node
proxy_server="proxy-server.mjs"
if ps aux | grep -v grep | grep -q "$proxy_server"; then
    echo "$proxy_server process is running."
else
    echo "No $proxy_server process is running."
fi