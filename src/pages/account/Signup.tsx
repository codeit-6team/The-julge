import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postUser, type UserType } from '@/api/userApi';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/assets/images/logo.svg';
import check from '@/assets/icons/modal_check.svg';
import not_checked from '@/assets/icons/not-checked.svg';

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    type: 'employee',
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password, type } = values;
    console.log('values', values);
    try {
      await postUser({ email, password, type: type as UserType });
      alert('가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <>
      <form
        className="mx-auto flex h-screen flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
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
          <div className="flex flex-col gap-8 text-body1/26 font-regular text-black">
            <label>회원 유형</label>
            <div className="flex justify-between">
              <div>
                <input
                  type="radio"
                  id="type-employee"
                  name="type"
                  value="employee"
                  className="sr-only"
                  checked={values.type === 'employee'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="type-employee"
                  className={`flex w-167 cursor-pointer items-center justify-center gap-9 rounded-full border py-13 ${
                    values.type === 'employee'
                      ? 'border-primary bg-white'
                      : 'border-gray-30'
                  }`}
                >
                  <img src={values.type === 'employee' ? check : not_checked} />
                  알바님
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="type-employer"
                  name="type"
                  value="employer"
                  className="sr-only"
                  checked={values.type === 'employer'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="type-employer"
                  className={`flex w-167 cursor-pointer items-center justify-center gap-9 rounded-full border py-13 ${
                    values.type === 'employer'
                      ? 'border-primary bg-white'
                      : 'border-gray-30'
                  }`}
                >
                  <img src={values.type === 'employer' ? check : not_checked} />
                  사장님
                </label>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={!isFormValid} className="w-350">
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
