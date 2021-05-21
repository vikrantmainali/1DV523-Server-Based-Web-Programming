# A03 Production

**How to run:**


1. What is the url to your application?
- https://cscloud6-84.lnu.se

2. Describe what you have done to make your application secure, both in code and when configuring your application server.
- The application uses Nginx as a reversed proxy which fowards the http requests that we make to the server and listens to it at port 3000. The application also uses HTTPS which helps ensure a secure connection. A private token from Gitlab is used in the application to fetch the webhooks. Secret token between the user and Gitlab is checked since Gitlab sends them in the 'x-gitlab-token' header. 

3. Describe the following parts, how you are using them, and what their purpose is in your solution:
    1. Reversed proxy - The reversed proxy sits in front of the web application and intercepts requests and communicates it to the web server. As mentioned earlier, this application uses Nginx as the reversed proxy, sending all reqests to port 3000. 
    2. Process manager
    3. TLS certificates
    4. Environment variables

4. What differs in your application when running it in development from running it in production?
-

5. Which extra modules did you use in the assignment? Motivate the use of them, and how you have to make sure that they are secure enough for production. 
-

6. Have you implemented any extra features (see below) that could motivate a higher grade of this assignment? If so, describe them - one by one.
- 

7. Are you satsified with your application? Does it have some improvement areas? What are you especially satisfied with?
-

8. What is your TIL for this course part?
- Biggest TIL for me from this assignment is how files are run and managed on a production server. This is the first time I have ever worked with a production server and despite all the issues I had configuring it and getting used to it, I think I will always remember what I've learned from this. 
