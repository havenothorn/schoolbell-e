import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import "./App.css";

interface FormValues {
  users: {
    name: string;
    password: string;
  }[];
}

type FormErrorKey =
  | "users"
  | `users.${number}`
  | `users.${number}.name`
  | `users.${number}.password`;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      users: [{ name: "", password: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const { users } = value;

      if (Array.isArray(users)) {
        const obj = users.reduce((obj, user, index) => {
          if (!user?.name) {
            return obj;
          }
          if (obj?.[user.name]) {
            setError(`users.${index}.name` as const, {
              type: "manual",
              message: "이미 사용 중인 이름입니다.",
            });
          }
          return { ...obj, [user.name]: (obj[user.name] || 0) + 1 };
        }, {} as Record<string, number>);
        console.log({ obj });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setError]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const result = document.querySelector(".result");
    if (result) {
      result.innerHTML = "";

      const formattedData = data.users.map((user) => ({
        name: user.name,
        password:
          user.password.length > 3
            ? user.password.substring(0, 3) +
              "*".repeat(user.password.length - 3)
            : "***",
      }));

      formattedData.forEach((user) => {
        const userElement = document.createElement("div");
        userElement.innerHTML = `<p class="name">name: ${user.name}</p><p class="password">password: ${user.password}</p>`;
        result.appendChild(userElement);
      });
      result.classList.remove("blind");
    }

    reset();
    Object.keys(errors).forEach((key) => {
      const errorKey = key as FormErrorKey;
      setError(errorKey, {});
    });

    // 에러가 있을 경우 Confirm 버튼 비활성화
    if (Object.keys(errors).length > 0) {
      const confirmButton = document.querySelector(".button[type='submit']");
      if (confirmButton) {
        confirmButton.setAttribute("disabled", "true");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        {fields.map((user, index) => (
          <div key={user.id} className="form">
            <div className="header-area">
              <h1 className="title">User-{index}</h1>
              <button
                className="remove-button"
                type="button"
                onClick={() => remove(index)}
              >
                X
              </button>
            </div>
            <div className="input-area">
              <label htmlFor={`name-${index}`}>Name</label>
              <input
                id={`name-${index}`}
                {...register(`users.${index}.name` as const, {
                  required: "required",
                  pattern: {
                    value: /^[a-zA-Z0-9가-힣]+$/,
                    message: "지원하지 않는 형식입니다.",
                  },
                  minLength: {
                    value: 3,
                    message: "이름은 최소 3글자 이상 입력해주세요.",
                  },
                })}
                type="text"
                className={`${errors.users?.[index]?.name ? "error" : ""}`}
              />
              <span role="alert" className="error-area">
                {errors.users?.[index]?.name?.message || ""}
              </span>
              <label htmlFor={`password-${index}`}>Password</label>
              <input
                id={`password-${index}`}
                {...register(`users.${index}.password` as const, {
                  required: "required",
                  minLength: {
                    value: 6,
                    message: "비밀번호는 최소 6글자 이상 입력해주세요.",
                  },
                })}
                type="password"
                className={`${errors.users?.[index]?.password ? "error" : ""}`}
              />
              <span role="alert" className="error-area">
                {errors.users?.[index]?.password?.message || ""}
              </span>
            </div>
          </div>
        ))}
        <div className="button-area">
          <button
            className="button"
            type="button"
            onClick={() => append({ name: "", password: "" })}
          >
            Add User
          </button>
          <button
            className="button"
            type="submit"
            disabled={Object.keys(errors).length > 0}
          >
            Confirm
          </button>
        </div>
      </form>
      <div className="result blind">
        <p className="name"></p>
        <p className="password"></p>
      </div>
    </>
  );
}

export default App;
