import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postUser } from '@/api/postUser';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/assets/images/logo.svg';

export default function Signup() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    type: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    emailError: '',
    passwordError: '',
    passwordCheckError: '',
  });
  const isFormValid =
    values.email &&
    values.password &&
    values.passwordCheck &&
    !errorMessages.emailError &&
    !errorMessages.passwordError &&
    !errorMessages.passwordCheckError;

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrorMessages((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.emailError = emailRegex.test(value)
          ? ''
          : '이메일 형식으로 작성해 주세요.';
      }

      if (name === 'password') {
        newErrors.passwordError =
          value.length >= 8 ? '' : '8자 이상 입력해주세요.';
        // 비밀번호가 바뀌면 비밀번호 확인도 다시 체크
        if (values.passwordCheck !== '') {
          newErrors.passwordCheckError =
            value === values.passwordCheck
              ? ''
              : '비밀번호가 일치하지 않습니다.';
        }
      }

      if (name === 'passwordCheck') {
        newErrors.passwordCheckError =
          value === values.password ? '' : '비밀번호가 일치하지 않습니다.';
      }

      return newErrors;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password, type } = values;
    console.log('values', values);
    try {
      await postUser({ email, password, type });
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <form className="mx-auto flex h-screen flex-col items-center justify-center">
        <Link to="/" className="mb-40 h-45 w-248">
          <img src={logo} />
        </Link>
        <div className="flex w-350 flex-col gap-28">
          <Input
            type="email"
            name="email"
            label="이메일"
            error={errorMessages.emailError}
            value={values.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            label="비밀번호"
            error={errorMessages.passwordError}
            value={values.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="passwordCheck"
            label="비밀번호 확인"
            error={errorMessages.passwordCheckError}
            value={values.passwordCheck}
            onChange={handleChange}
            required
          />
          <Button
            disabled={!isFormValid}
            className="w-350"
            onClick={handleSubmit}
          >
            가입하기
          </Button>
        </div>
        <p className="mt-16">
          이미 가입하셨나요?{' '}
          <Link to="/login" className="text-blue-500 underline">
            로그인하기
          </Link>
        </p>
      </form>
    </>
  );
}
