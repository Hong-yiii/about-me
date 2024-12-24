---
title: "Soybean Decision Support System: Leveraging NASA Satellite Data"
excerpt: "NASA SpaceApps 2024, My team developed a data-driven approach towards optimizing decision making in selecting appropriate Soy Beans by regions"
coverImage: "/assets/blog/NASA_SpaceApps/Mr_Bean_Homepage.png"
date: "2024-10-06T05:35:07.322Z"
author:
  name: Pandas, Numpy, Data Visualization, API Integration
  picture: "/assets/blog/authors/The_Game_Team_Photo.jpg"
ogImage:
  url: "/assets/blog/NASA_SpaceApps/Mr_Bean_Homepage.png"
---

# **Soybean Decision Support System: Leveraging NASA Satellite Data**

At the intersection of data science, web development, and environmental research. Developed during the NASA Space Apps Challenge 2024.
The web application empowers soybean farmers with data-driven insights, enabling precise decision-making tailored to regional climate and soil conditions.

---
## Contextual overview

**2 main discoveries made by the Team served as the foundation of our project:**
1. The choice of Soy Beans strains are highly dependant on climate conditions
2. Soy beans are places into 4 groups, data for the optimal soy bean is classified by state in the US, this is readily availible in the US but not worldwide.

### So what next?
With the help of historical satellite data, we would be able to create a dataset of known optimal conditions for each strain of soy.
Given any location, we can then obtain the optimal soy bean group (1 through 4) to assign to the location.

---

## How we did it:
- Utilize NASA’s API to pull MERRA-2 satellite data in conjunction with Regional Soy Bean Type reccomendations to create a dataset.
- Develop a system to evaluate the climate similarity of 2 datapoints using Euclidean distance.
- Create a user-friendly platform to recommend optimal soybean variants based on location inputted by the User

---

### **Key Features of the Application**

#### **1. Data Science Integration**

- Leveraged NASA’s MERRA-2 weather sensor dataset, capturing critical metrics like surface temperature, precipitation, and exchange coefficients for heat.
- Implemented a weighted Euclidean distance algorithm to analyze geographic conditions, comparing user inputs to reference data points for accurate soybean variant recommendations.

#### **2. User-Friendly Web Interface**

![Homepage View](/assets/blog/NASA_SpaceApps/Mr_Bean_Homepage_full.png)

- The frontend, hosted on Wix, offers an intuitive user experience, designed for farmers of all technical backgrounds.
- Features include location-based data inputs, real-time analysis, and interactive visualizations that highlight why a specific soybean variant was recommended.

#### **3. Modular Backend Design**

- Developed a robust backend capable of handling large datasets and efficient API integrations.
- Functions include pulling satellite data directly from NASA’s MERRA-2 API, preprocessing geographic datasets, and dynamically generating reference datasets for optimal crop suggestions.

![Homepage View](/assets/blog/NASA_SpaceApps/output_page.png)

---

### **Technical Highlights:**

#### **Algorithm Development**

- A weighted Euclidean distance approach ensures the system recommends soybean variants with the closest environmental match to user-provided location.

#### **Data Preprocessing**

- Satellite data was filtered and pre-processed to balance precision and efficiency, reducing database size while maintaining high analytical accuracy.

#### **Seamless API Integration**

- The backend scripts efficiently pull, preprocess, and store satellite data in `.nc4` files, creating a dynamic dataset that can be refreshed.


---

## **Explore the Code**

Dive into the technical implementation and explore the project repository: 
[GitHub Repository: MR_BEAN](https://github.com/Hong-yiii/MR_BEAN)

---