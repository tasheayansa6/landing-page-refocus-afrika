import { useEffect, useRef } from "react";
import { landingBody } from "./landingBody.js";

/** Public landing — same content as the Netlify page / syllabus program. No admin link. */
export default function Home() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const homeView = root.querySelector("#page-home");
    const registerView = root.querySelector("#page-register");
    const headerBtn = root.querySelector('header a[data-path="register"]');

    function navigateTo(route, push) {
      if (!homeView || !registerView) return;
      const isRegister =
        route === "register" ||
        route === "#/register" ||
        route === "/register";

      if (isRegister) {
        homeView.classList.add("hidden");
        registerView.classList.remove("hidden");
        if (headerBtn) {
          headerBtn.classList.remove(
            "bg-secondary-container",
            "hover:bg-primary-container"
          );
          headerBtn.classList.add("bg-primary", "text-on-primary");
        }
        if (push !== false) {
          window.history.pushState({ route: "register" }, "", "#/register");
        }
      } else {
        registerView.classList.add("hidden");
        homeView.classList.remove("hidden");
        if (headerBtn) {
          headerBtn.classList.remove("bg-primary", "text-on-primary");
          headerBtn.classList.add(
            "bg-secondary-container",
            "hover:bg-primary-container"
          );
        }
        if (push !== false) {
          window.history.pushState({ route: "home" }, "", "#/");
        }
      }
      window.scrollTo(0, 0);
    }

    function checkRoute() {
      const hash = window.location.hash || "";
      if (hash.includes("register")) navigateTo("register", false);
      else navigateTo("home", false);
    }

    function onClick(e) {
      const link = e.target.closest('a[data-path], a[href^="#/"]');
      if (!link || !root.contains(link)) return;
      const dataPath = link.getAttribute("data-path");
      const href = link.getAttribute("href");
      if (
        dataPath === "register" ||
        href === "#/register" ||
        href === "/register"
      ) {
        e.preventDefault();
        navigateTo("register", true);
      } else if (
        dataPath === "home" ||
        href === "#/" ||
        href === "#page-home"
      ) {
        e.preventDefault();
        navigateTo("home", true);
      }
    }

    root.querySelectorAll("#pathway-chips .pathway-btn").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("#pathway-chips .pathway-btn").forEach((btn) => {
          btn.classList.remove("bg-primary", "text-on-primary");
          btn.classList.add(
            "bg-surface-container-high",
            "text-on-surface-variant"
          );
        });
        button.classList.remove(
          "bg-surface-container-high",
          "text-on-surface-variant"
        );
        button.classList.add("bg-primary", "text-on-primary");
      });
    });

    const fullForm = root.querySelector("#full-cohort-register-form");
    const fullFormContainer = root.querySelector(
      "#full-register-form-container"
    );
    const fullSuccess = root.querySelector("#full-registration-success");
    function onSubmit(e) {
      e.preventDefault();
      if (fullFormContainer && fullSuccess) {
        fullFormContainer.classList.add("hidden");
        fullSuccess.classList.remove("hidden");
        fullSuccess.classList.add("flex");
      }
    }
    if (fullForm) fullForm.addEventListener("submit", onSubmit);

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", checkRoute);
    window.addEventListener("hashchange", checkRoute);
    checkRoute();

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", checkRoute);
      window.removeEventListener("hashchange", checkRoute);
      if (fullForm) fullForm.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingBody }} />
  );
}
