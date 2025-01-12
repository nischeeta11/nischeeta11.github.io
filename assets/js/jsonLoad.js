$(document).ready(function () {
  // Load education data
  $.getJSON("json/education.json", function (data) {
    let educationHTML = "";
    data.forEach(function (item) {
      educationHTML += `<div class="education-item">
                        <h3>${item.degree}</h3>
                        <h4>${item.university}</h4>
                        <p>${item.fieldOfStudy}</p>
                        <p>Expected Graduation: ${item.graduationDate}</p>
                    </div>`;
    });
    $("#education").html(educationHTML);
  });

  // Load experience data
  $.getJSON("json/experience.json", function (data) {
    let experienceHTML = "";
    data.forEach(function (item) {
      experienceHTML += `<div class="experience-item">
                        <h3>${item.jobTitle}</h3>
                        <h4>${item.company}</h4>
                        <p>${item.location}</p>
                        <p>${item.dates}</p>
                        <ul>`;
      item.responsibilities.forEach(function (resp) {
        experienceHTML += `<li>${resp}</li>`;
      });
      experienceHTML += `</ul></div>`;
    });
    $("#experience").html(experienceHTML);
  });

  // Load skills data
  $.getJSON("json/skills.json", function (data) {
    let skillsHTML = "";

    // First Row: Soft Skills and Languages with equal height
    skillsHTML += `<div class="row d-flex align-items-stretch">`;

    // Soft Skills
    skillsHTML += `<div class="col-md-6 mb-4 d-flex">
      <div class="skills-item flex-fill" data-aos="fade-up" data-aos-delay="200">
        <h3 class="skill-category">Soft Skills</h3>
        <ul class="list-unstyled">`;
    data.softSkills.forEach(function (skill) {
      skillsHTML += `<li class="skill"><i class="bi bi-check-circle-fill"></i> ${skill}</li>`;
    });
    skillsHTML += `</ul></div></div>`;

    // Languages
    skillsHTML += `<div class="col-md-6 mb-4 d-flex">
      <div class="skills-item flex-fill" data-aos="fade-up" data-aos-delay="300">
        <h3 class="skill-category">Languages</h3>
        <ul class="list-unstyled">`;
    data.languages.forEach(function (language) {
      skillsHTML += `<li class="skill"><i class="bi bi-check-circle-fill"></i> ${language}</li>`;
    });
    skillsHTML += `</ul></div></div>`;

    skillsHTML += `</div>`; // Close the first row

    // Second Row: Technical Skills, broken into multiple columns for larger screens
    skillsHTML += `<div class="row">`;
    skillsHTML += `<div class="col-md-12 mb-4">
      <div class="skills-item" data-aos="fade-up" data-aos-delay="400">
        <h3 class="skill-category">Technical Skills</h3>
        <div class="row">`; // Start new row for columns

    // Break technical skills into 2 or 3 columns for larger screens
    data.technicalSkills.forEach(function (skill, index) {
      if (index % 4 === 0) {
        skillsHTML += `<div class="col-md-6"><ul class="list-unstyled">`; // New column every 6 items
      }
      skillsHTML += `<li class="skill"><i class="bi bi-check-circle-fill"></i> ${skill}</li>`;
      if (index % 4 === 3 || index === data.technicalSkills.length - 1) {
        skillsHTML += `</ul></div>`; // Close column after 6 items
      }
    });

    skillsHTML += `</div></div></div></div>`; // Close row and skill-item divs

    $("#skills-list").html(skillsHTML);
  }).fail(function (jqxhr, textStatus, error) {
    console.error("Error loading JSON: " + textStatus + ", " + error);
  });

  // Load awards data
  $.getJSON("json/awards.json", function (data) {
    let awardsHTML = "";
    data.forEach(function (item) {
      awardsHTML += `<div class="award-item">
                        <h3>${item.awardName}</h3>
                        <h4>${item.issuingOrganization}</h4>
                        <p>${item.dateReceived}</p>
                    </div>`;
    });
    $("#awards").html(awardsHTML);
  });

  // Load portfolio data
  $.getJSON("json/projects.json", function (data) {
    let portfolioHTML = "";
    let countryFiltersHTML = `<li data-filter="*" class="filter-active">All</li>`;
    let uniqueCountries = [];

    // Collect unique countries for the filter buttons
    data.forEach(function (item) {
      if (!uniqueCountries.includes(item.country)) {
        uniqueCountries.push(item.country);
      }
    });

    // Generate country filter buttons dynamically
    uniqueCountries.forEach(function (country) {
      countryFiltersHTML += `<li data-filter=".filter-${country}">${country}</li>`;
    });
    $("#countryFilters").html(countryFiltersHTML);

    // Generate portfolio items dynamically
    data.forEach(function (item) {
      portfolioHTML += `<div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.country}">
                          <div class="portfolio-content h-100">
                            <img src="${item.image}" class="img-fluid" alt="${item.title}">
                            <div class="portfolio-info">
                              <h4><a href="#" class="country-filter" data-country=".filter-${item.country}"  style='color:white;'>${item.country}</a></h4>
                              <p>${item.title}</p>
                              <a href="${item.image}" title="${item.title}" target="_blank" data-gallery="portfolio-gallery-${item.title}" class="glightbox preview-link">
                                <i class="bi bi-zoom-in"></i></a>
                              <a href="project-details.html?slug=${item.slug}" title="More Details" class="details-link">
                                <i class="bi bi-link-45deg"></i></a>
                            </div>
                          </div>
                        </div>`;
    });
    $("#projectContainer").html(portfolioHTML);

    // Initialize isotope layout for filtering
    var $grid = $(".isotope-container").isotope({
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows",
    });

    // Filter portfolio on filter button click
    $(".isotope-filters li").on("click", function () {
      $(".isotope-filters li").removeClass("filter-active");
      $(this).addClass("filter-active");
      var filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });

    // Use imagesLoaded to wait for images to fully load before triggering layout
    $grid.imagesLoaded().progress(function () {
      $grid.isotope("layout"); // Trigger Isotope layout recalculation after each image loads
    });

    // When filter buttons are clicked, filter the items
    $(".portfolio-filters li").on("click", function () {
      $(".portfolio-filters li").removeClass("filter-active");
      $(this).addClass("filter-active");
      var filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });

    // Filter portfolio by clicking on the country name in the portfolio item
    // $(document).on("click", ".country-filter", function (e) {
    //   e.preventDefault();
    //   var countryFilter = $(this).data("country");
    //   $grid.isotope({ filter: countryFilter });
    //   $(".isotope-filters li").removeClass("filter-active");
    //   $(`.isotope-filters li[data-filter="${countryFilter}"]`).addClass(
    //     "filter-active"
    //   );
    // });
  });

  // Load mentorship data
  //   $.getJSON("json/mentorship.json", function (data) {
  //     let mentorshipHTML = "";
  //     data.forEach(function (item) {
  //       mentorshipHTML += `<div class="mentorship-item">
  //                         <h3>${item.title}</h3>
  //                         <h4>${item.organization}</h4>
  //                         <p>${item.location}</p>
  //                         <p>${item.dates}</p>
  //                         <p>${item.details}</p>
  //                     </div>`;
  //     });
  //     $("#mentorship").html(mentorshipHTML);
  //   });
});
