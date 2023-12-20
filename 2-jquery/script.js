// 여기에 정답을 작성해주세요

const $ = (target) => {
  const element = document.querySelector(target);

  const addClass = (className) => {
    element.classList.add(className);
    return $(target);
  };

  const removeClass = (className) => {
    element.classList.remove(className);
    return $(target);
  };

  const css = (...styles) => {
    if (typeof styles[0] === "string") {
      const [prop, value] = styles;
      element.style[prop] = value;
    } else if (typeof styles[0] === "object") {
      const styleObject = styles[0];
      Object.assign(element.style, styleObject);
    }
    return $(target);
  };

  const fadeOut = (callback) => {
    let level = 1;

    const outTimer = setInterval(() => {
      level = Math.max(level - 0.1, 0);
      element.style.opacity = level;

      if (level <= 0) {
        clearInterval(outTimer);
        typeof callback === "function" && callback();
      }
    }, 50);
  };

  return { addClass, removeClass, css, fadeOut };
};
// 아래 코드는 수정하지 않습니다

// 1
$("#target-1").removeClass("border");

// 2
$("#target-1").css("left", "250px");

// 3
$(".target-2").removeClass("border").addClass("blue");

// 4
$(".target-2").css({ left: 50, "margin-top": "-15px" });

// 5
$("#target-3").fadeOut(() => $("#target-4").addClass("green"));
