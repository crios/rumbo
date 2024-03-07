#!/bin/bash
# Deploy web project to UAT apache web server
SERVER=ec2-user@44.235.72.41

grunt build
ssh -i soltec.pem $SERVER mv rombusApp.zip rombusApp.zip.bk
scp -i soltec.pem rombusApp.zip $SERVER:rombusApp.zip
ssh -i soltec.pem $SERVER ./deploy.sh