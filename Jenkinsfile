node {
    checkout scm

    docker.withRegistry('https://registry.hub.docker.com', '2277acb4-7502-4af6-b415-4d64e80ffdfe') {

        def customImage = docker.build("ektasharma95/nodejs-app-demo")

        /* Push the container to the custom Registry */
        customImage.push()
    }
}