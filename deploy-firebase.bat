@echo off
echo Deploying Firebase rules...

REM Deploy Firestore rules
echo Deploying Firestore rules...
firebase deploy --only firestore:rules

REM Deploy Storage rules
echo Deploying Storage rules...
firebase deploy --only storage

echo Firebase rules deployment complete!
pause
