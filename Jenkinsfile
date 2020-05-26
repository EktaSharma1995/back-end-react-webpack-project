node {
    stage('Build/push') {
        checkout scm

        docker.withRegistry('https://registry.hub.docker.com', '2277acb4-7502-4af6-b415-4d64e80ffdfe') {

        def customImage = docker.build("ektasharma95/nodejs-app-demo")
    
        /* Push the container to the custom Registry */
        customImage.push()
        } 
    }

    // stage('Dangling Images') {
    //   sh 'docker images -q -f dangling=true | xargs --no-run-if-empty docker rmi'
    // }

    stage('Pull image on Container'){
        def nodeImage = docker.image('ektasharma95/nodejs-app-demo');
        nodeImage.pull;

        dir("/root/back-end-react-webpack-project"){
            sh "docker-compose -f docker-compose.prod.yml up --build"
        }

    }    



}