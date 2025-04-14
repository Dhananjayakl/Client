import { useState, useEffect } from "react";
import { FormText } from "react-bootstrap";
import { useWatch } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const JSHook = (form, formMetaData, formMethods, formValues, control) => {
  form.program.onChange(function (value) {
    formMethods.setValue("category", "");
    formMetaData.fields.category.required = true;
  });

  const ratings = useWatch({
    control,
    name: `RTG`,
  });

  console.log(ratings, "Rating added in this designer");

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  form.onLoad = () => {
    const scoring = formMetaData?.configurationFormMetaData?.scoring;
    const instructions =
      formMetaData?.configurationFormMetaData?.page_instructions;
    const introductionPage =
      formMetaData?.configurationFormMetaData?.introduction_page;
    const endingPage = formMetaData?.configurationFormMetaData?.survey_end_page;
    const certificationPage =
      formMetaData?.configurationFormMetaData?.certification_page;

    formMethods.setValue("enableScoring", scoring);
    formMethods.setValue("enableInstructions", instructions);
    formMethods.setValue("enableIntroductionPage", introductionPage);
    formMethods.setValue("enableEndingPage", endingPage);
    formMethods.setValue("enableCertificationPage", certificationPage);
  };

  useEffect(() => {
    const Buttons = document.querySelectorAll(".disbutton");

    const handleFormSubmit = (e) => {
      Buttons.forEach((button) => {
        const buttonText = button.textContent.trim();
        if (buttonText === "Publish") {
          const currentPages = formMethods.getValues("PGE");
          const currentSections = formMethods.getValues("SEC");
          const currentQuestions = formMethods.getValues("QST");
          const currentRatings = formMethods.getValues("RTG");

          let invalidPages = [];
          let invalidSections = [];

          // Check each page to ensure it has at least one section
          currentPages.forEach((page) => {
            const sectionsForPage = currentSections.filter(
              (section) => section.secPgeCode === page.pgeCode
            );

            if (sectionsForPage.length === 0) {
              invalidPages.push(page.pgeTitle || "Untitled Page");
            }

            // Check each section to ensure it has at least one question
            sectionsForPage.forEach((section) => {
              const questionsForSection = currentQuestions.filter(
                (question) => question.qstSecCode === section.secCode
              );
              if (questionsForSection.length === 0) {
                invalidSections.push(section.secTitle || "Untitled Section");
              }
            });
          });

          // If there are pages without sections, show an alert
          if (invalidPages.length > 0) {
            alert(
              `The following pages are missing sections:\n\n${invalidPages.join(
                "\n"
              )}\n\nPlease add at least one section and question to these pages before submitting.`
            );
            // toast.warning(`Please add sections to:${invalidPages.join("\n")}`, {
            //   position: "top-right",
            // });
            e.preventDefault();
            return false;
          }

          // If there are sections without questions, show an alert
          if (invalidSections.length > 0) {
            alert(
              `The following sections are missing questions:\n\n${invalidSections.join(
                "\n"
              )}\n\nPlease add at least one question to these sections before submitting.`
            );
            // toast.warning(
            //   `Please add questions to:
            //   ${invalidSections.join("\n")}`,
            //   {
            //     position: "top-right",
            //   }
            // );
            e.preventDefault();
            return false;
          }

          // If no questions are added at all, prevent submission
          if (!currentQuestions || currentQuestions.length < 1) {
            alert(
              "Please make sure to add at least one question before submitting the questionnaire."
            );
            e.preventDefault();
            return;
          }

          if (currentRatings.length <= 0) {
            alert(
              "Please make sure to add a rating before submitting the questionnaire."
            );
            e.preventDefault();
            return false;
          } else {
            let isValid = true;

            for (let i = 0; i < currentRatings.length; i++) {
              const current = currentRatings[i];

              if (
                parseFloat(current.rtgLowerValue) >=
                parseFloat(current.rtgUpperValue)
              ) {
                alert(
                  `Row ${i + 1}: Lower value should be less than upper value.`
                );
                formMethods.setError(`RTG[${i}].rtgLowerValue`, {
                  type: "manual",
                  message: `Row ${i}: Lower value should be less than upper value.`,
                });
                isValid = false;
                break; // Exit loop if validation fails
              }

              if (i < currentRatings.length - 1) {
                const next = currentRatings[i + 1];
                if (
                  parseFloat(current.rtgUpperValue) >=
                  parseFloat(next.rtgLowerValue)
                ) {
                  alert(
                    `Row ${
                      i + 1
                    }: Upper value should be less than the lower value of the next row.`
                  );
                  console.log(
                    `RTG[${i}].rtgUpperValue`,
                    "`RTG[${i}].rtgUpperValue`"
                  );
                  formMethods.setError(`RTG[${i}].rtgUpperValue`, {
                    type: "manual",
                    message: `Row ${
                      i + 1
                    }: Upper value should be less than the lower value of the next row.`,
                  });
                  formMethods.setError();
                  isValid = false;
                  break;
                }
              }
            }

            if (isValid) {
            } else {
              e.preventDefault(); // Prevent form submission if validation failed
              return false;
            }
          }
        }
      });
    };

    Buttons.forEach((button) => {
      const buttonText = button.textContent.trim();
      if (buttonText === "Publish") {
        button.addEventListener("click", handleFormSubmit);
      }
    });

    return () => {
      Buttons.forEach((button) => {
        button.removeEventListener("click", handleFormSubmit);
      });
    };
  }, [formMethods, control, formValues]);

  form.onLoad();
  return form;
};

export default JSHook;
