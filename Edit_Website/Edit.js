const linkH = document.getElementById("linkH");
const link1 = document.getElementById("link1");
const link2 = document.getElementById("link2");
const link3 = document.getElementById("link3");
// const link4 = document.getElementById("link4");
const link5 = document.getElementById("link5");
const linkF = document.getElementById("linkF");
var state;

async function getSection(section) {
  section = await fetch(` http://localhost:8000/response/${section}`);
  return (await section.json()).response;
}

async function callToChange(element) {
  var formData;
  await fetch(`http://localhost:8000/formData/1`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Connection failed");
      }
      return response.json();
    })
    .then((data) => {
      formData = data;
    });

  if (element.generateAgain == "Generate Again") {
    switch (element.element.classList.value) {
      case "Header_AXZCAASD":
        requestTheChange({
          section: "Header",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Section1_AXZCAASD img_Section1":
        requestTheChange({
          section: "Section1",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Section2_AXZCAASD":
        requestTheChange({
          section: "Section2",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Section3_AXZCAASD":
        requestTheChange({
          section: "Section3",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Section4_AXZCAASD":
        requestTheChange({
          section: "Section4",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Section5_AXZCAASD":
        requestTheChange({
          section: "Section5",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
      case "Footer_AXZCAASD":
        requestTheChange({
          section: "Footer",
          ReStatus: element.generateAgain,
          formData,
        });
        break;
    }
  } else if (element.generateAgain == "Fix the code") {
    switch (element.element.classList.value) {
      case "Header_AXZCAASD":
        requestTheChange({
          section: "Header",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Header"),
        });
        break;
      case "Section1_AXZCAASD img_Section1":
        requestTheChange({
          section: "Section1",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Section1"),
        });
        break;
      case "Section2_AXZCAASD":
        requestTheChange({
          section: "Section2",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Section2"),
        });
        break;
      case "Section3_AXZCAASD":
        requestTheChange({
          section: "Section3",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Section3"),
        });
        break;
      case "Section4_AXZCAASD":
        requestTheChange({
          section: "Section4",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Section4"),
        });
        break;
      case "Section5_AXZCAASD":
        requestTheChange({
          section: "Section5",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Section5"),
        });
        break;
      case "Footer_AXZCAASD":
        requestTheChange({
          section: "Footer",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
          code: await getSection("Footer"),
        });
        break;
    }
  } else if (element.generateAgain == "User preferences") {
    switch (element.element.classList.value) {
      case "Header_AXZCAASD":
        requestTheChange({
          section: "Header",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Section1_AXZCAASD img_Section1":
        requestTheChange({
          section: "Section1",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Section2_AXZCAASD":
        requestTheChange({
          section: "Section2",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Section3_AXZCAASD":
        requestTheChange({
          section: "Section3",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Section4_AXZCAASD":
        requestTheChange({
          section: "Section4",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Section5_AXZCAASD":
        requestTheChange({
          section: "Section5",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
      case "Footer_AXZCAASD":
        requestTheChange({
          section: "Footer",
          ReStatus: element.generateAgain,
          formData,
          instructions: element.instructions,
        });
        break;
    }
  }
}
function requestTheChange(sectionClass) {
  fetch("http://localhost:3000/submit-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sectionClass),
  }).then((res) => {
    if (res.status === 200) {
      setTimeout(() => {
        location.reload();
        location.reload();
      }, 1000);
    }
  });
}

function editField(element) {
  if (state === true) {
    const editField = document.getElementById("editField");
    editField.remove();
    state = false;
    return;
  } else {
    const editField = document.createElement("div");
    editField.id = "editField";
    editField.style.position = "fixed";
    editField.style.top = "50%";
    editField.style.left = "50%";
    editField.style.transform = "translate(-50%, -50%)";
    editField.style.backgroundImage =
      "linear-gradient(-45deg, hsla(172, 88%, 30%, 1) 0%,hsla(172, 88%, 20%, 1) 20%,hsla(172, 88%, 30%, 1) 40%,hsla(172, 88%, 20%, 1) 60%,hsla(172, 88%, 30%, 1) 80%,hsla(172, 88%, 20%, 1) 100%)";
    editField.style.color = "#fff";
    editField.style.border = "none";
    editField.style.width = "500px";
    editField.style.height = "500px";
    editField.style.borderRadius = "10px";
    editField.style.display = "flex";
    editField.style.flexDirection = "column";
    editField.style.justifyContent = "center";
    editField.style.alignItems = "center";
    editField.style.boxShadow = "3px 2px 8px black";
    document.getElement;

    document.body.appendChild(editField);
    state = true;

    // ReGenerate button that will run the code for the section again
    const reGenerate = document.createElement("button");
    reGenerate.style.width = "calc(100% - 40px)";
    reGenerate.style.height = "calc(100% - 300px)";
    reGenerate.textContent = "Generate Section Again";
    reGenerate.style.borderRadius = "10px";
    reGenerate.style.margin = "20px";
    reGenerate.style.boxShadow = "3px 2px 8px black";
    reGenerate.style.fontWeight = "bold";
    reGenerate.style.fontSize = "25px";
    reGenerate.style.cursor = "pointer";
    reGenerate.addEventListener("mouseenter", () => {
      reGenerate.style.backgroundColor = "rgba(6, 197, 172, 0.5)";
    });
    reGenerate.addEventListener("mouseleave", () => {
      reGenerate.style.backgroundColor = "white";
    });
    reGenerate.addEventListener("click", () => {
      callToChange({ element, generateAgain: "Generate Again" });
      editField.remove();
      state = false;
    });
    editField.appendChild(reGenerate);

    // Generate new code from the old code and with fixes for the user input
    const reGenerateFixing = document.createElement("textarea");
    reGenerateFixing.type = "text";
    reGenerateFixing.style.width = "calc(100% - 45px)";
    reGenerateFixing.style.height = "80%";
    reGenerateFixing.style.borderRadius = "10px";
    reGenerateFixing.style.boxShadow = "3px 2px 8px black";
    reGenerateFixing.style.fontSize = "20px";
    reGenerateFixing.style.resize = "none";
    reGenerateFixing.placeholder =
      "Give instructions on how you would like to change the section...";

    editField.appendChild(reGenerateFixing);

    const reGenerateFixingBtn = document.createElement("button");
    reGenerateFixingBtn.style.width = "calc(100% - 40px)";
    reGenerateFixingBtn.style.height = "calc(100% - 300px)";
    reGenerateFixingBtn.textContent = "Fix the current section";
    reGenerateFixingBtn.style.borderRadius = "10px";
    reGenerateFixingBtn.style.margin = "20px";
    reGenerateFixingBtn.style.boxShadow = "3px 2px 8px black";
    reGenerateFixingBtn.style.fontWeight = "bold";
    reGenerateFixingBtn.style.fontSize = "25px";
    reGenerateFixingBtn.style.cursor = "pointer";
    reGenerateFixingBtn.addEventListener("mouseenter", () => {
      reGenerateFixingBtn.style.backgroundColor = "rgba(6, 197, 172, 0.5)";
    });
    reGenerateFixingBtn.addEventListener("mouseleave", () => {
      reGenerateFixingBtn.style.backgroundColor = "white";
    });
    reGenerateFixingBtn.addEventListener("click", () => {
      callToChange({
        element,
        generateAgain: "Fix the code",
        instructions: reGenerateFixing.value,
      });
      editField.remove();
      state = false;
    });
    editField.appendChild(reGenerateFixingBtn);

    // Generate new code with only the user input
    const reGenerateInput = document.createElement("textarea");
    reGenerateInput.type = "text";
    reGenerateInput.style.width = "calc(100% - 45px)";
    reGenerateInput.style.height = "80%";
    reGenerateInput.style.borderRadius = "10px";
    reGenerateInput.style.boxShadow = "3px 2px 8px black";
    reGenerateInput.style.fontSize = "20px";
    reGenerateInput.style.resize = "none";
    reGenerateInput.placeholder =
      "Give instructions on how would you want this section to be...";

    editField.appendChild(reGenerateInput);

    const reGenerateInputBtn = document.createElement("button");
    reGenerateInputBtn.style.width = "calc(100% - 40px)";
    reGenerateInputBtn.style.height = "calc(100% - 300px)";
    reGenerateInputBtn.textContent = "Generate by Input";
    reGenerateInputBtn.style.borderRadius = "10px";
    reGenerateInputBtn.style.margin = "20px";
    reGenerateInputBtn.style.boxShadow = "3px 2px 8px black";
    reGenerateInputBtn.style.fontWeight = "bold";
    reGenerateInputBtn.style.fontSize = "25px";
    reGenerateInputBtn.style.cursor = "pointer";
    reGenerateInputBtn.addEventListener("mouseenter", () => {
      reGenerateInputBtn.style.backgroundColor = "rgba(6, 197, 172, 0.5)";
    });
    reGenerateInputBtn.addEventListener("mouseleave", () => {
      reGenerateInputBtn.style.backgroundColor = "white";
    });
    reGenerateInputBtn.addEventListener("click", () => {
      callToChange({
        element,
        generateAgain: "User preferences",
        instructions: reGenerateInput.value,
      });
      editField.remove();
      state = false;
    });
    editField.appendChild(reGenerateInputBtn);
  }
}

function addWrench(element) {
  console.log("entered " + element);
  element.style.position = "relative";
  // Create and append the element
  const wrench = document.createElement("i");
  wrench.style.position = "absolute";
  wrench.style.right = "10px";
  wrench.style.top = "10px";
  wrench.className = "fa-solid fa-gear";
  wrench.style.color = "#757575";
  wrench.style.fontSize = "40px";
  wrench.style.cursor = "pointer";
  wrench.style.backgroundColor = "#FFFFFF";
  wrench.style.borderRadius = "10px";
  wrench.style.padding = "3px";
  wrench.style.boxShadow = "0px 0px 6px 0px black";
  wrench.style.zIndex = "1000";
  wrench.addEventListener("click", () => {
    editField(element);
  });
  wrench.addEventListener("mouseover", () => {
    wrench.style.color = "#000000";
  });
  wrench.addEventListener("mouseout", () => {
    wrench.style.color = "#757575";
  });
  element.appendChild(wrench);
}

function removeWrench(element) {
  // Remove the added element
  const addedElement = element.querySelector("i");
  if (addedElement) {
    element.removeChild(addedElement);
  }
}

linkH.addEventListener("mouseenter", () => {
  addWrench(linkH);
});

linkH.addEventListener("mouseleave", () => {
  removeWrench(linkH);
});

link1.addEventListener("mouseenter", () => {
  addWrench(link1);
});

link1.addEventListener("mouseleave", () => {
  removeWrench(link1);
});

link2.addEventListener("mouseenter", () => {
  addWrench(link2);
});

link2.addEventListener("mouseleave", () => {
  removeWrench(link2);
});

link3.addEventListener("mouseenter", () => {
  addWrench(link3);
});

link3.addEventListener("mouseleave", () => {
  removeWrench(link3);
});

// link4.addEventListener("mouseenter", () => {
//   addWrench(link4);
// });

// link4.addEventListener("mouseleave", () => {
//   removeWrench(link4);
// });

link5.addEventListener("mouseenter", () => {
  addWrench(link5);
});

link5.addEventListener("mouseleave", () => {
  removeWrench(link5);
});

linkF.addEventListener("mouseenter", () => {
  addWrench(linkF);
});

linkF.addEventListener("mouseleave", () => {
  removeWrench(linkF);
});
