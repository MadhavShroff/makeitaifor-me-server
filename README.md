# makeitaifor-me-server

# Ansible command for makeitaifor.me server CI/CD
```bash
    # Redeploy server, clean output from ansible
    ansible-playbook -i ansible/hosts.yml ansible/redeploy.yml | awk -F'msg": "' '!(/ok: \[/ && /\(item=/ && /=> \{/ || /}/) {if(NF>1) {print substr($2, 1, length($2)-1)} else {print}}'
```