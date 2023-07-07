# makeitaifor-me-server

# Ansible command for makeitaifor.me server CI/CD
```bash
    # Redeploy server, clean output from ansible
    ansible-playbook -i ansible/hosts.yml ansible/redeploy.yml | awk -F'msg": "' '!(/ok: \[/ && /\(item=/ && /=> \{/ || /}/) {if(NF>1) {print substr($2, 1, length($2)-1)} else {print}}'
```

# aws cli command to describe user pool
```bash
   aws cognito-idp describe-user-pool --user-pool-id USER_POOL_ID; 
   aws cognito-idp describe-user-pool-client --user-pool-id USER_POOL_ID --client-id CLIENT_ID;
```