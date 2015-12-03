FROM node:0.12.7-onbuild
MAINTAINER Matthias Sainz 

WORKDIR /home/uberAPI

ADD ./ /hom/uberAPI

#add other install reqs here...if to many add a script to do this 
#and call that instead
RUN npm install --save loopback-connector-mongodb &&  \
    npm install --save bcrypt && \
    npm install 

EXPOSE 3000
CMD ["node ."]
