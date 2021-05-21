# A01 Web scraper

**How to run:**

1. **npm install**
   - installs all the dependencies

2. **npm start https://courselab.lnu.se/scraper-site-1 or npm start https://courselab.lnu.se/scraper-site-2** 
    - runs the application

****Questions:****

1. Describe the architecture of your application. How have you structured your code and what are your thoughts behind the architecture?
- I have used a Three-tier architecture where app.js is the presentation tier, scraper.js is the logic tier and the website to scrape is thae data tier. The main implementation for the application is done in scraper.js and the initialization of the application is done from app.js. The web scraper application is simple (i.e, not requiring a lot of functions) and therefore this architecture worked well for this application. 

2. What Node concepts are essential to learn as a new programmer, when diving into Node? What would your recommendations be to a new wanna-be-Node-programmer?
- The essential concepts to learn Node as a new programmer are: knowing your way around Javascript, how modules work, how properties work and promises. 
My recommendations would be as follows: try to brainstorm the architecture before implementation, research about all possible dependencies that will help you implement your program, and structure your code so that even the smallest parts of the code can be found easily. 

3. Are you satsified with your application? Does it have some improvement areas? What are you especially satisfied with?
- I am satisfied with how the application has turned out but there are definitely improvement areas. There are minor code edits that are needed to make the code cleaner. There are some variables that can be removed and updated as well. The part that I am most satisfied with is the reserve function in scraper.js.  

4. What is your TIL for this course part?
- The biggest takeaway for me from this assignment is using the Cheerio to interpret and analyze a web page and Axios library to perform HTTP requests.
