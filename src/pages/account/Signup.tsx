import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postUser, type UserType } from '@/api/userApi';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import logo from '@/assets/images/logo.svg';
import checked from '@/assets/icons/modal_check.svg';
import not_checked from '@/assets/icons/not-checked.svg';

interface SignupState {
  email: string;
  password: string;
  passwordCheck: string;
  type: UserType;
}

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignupState>({
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
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
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
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;

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
    const { email, password, passwordCheck, type } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8;
    const isPasswordCheckValid = password === passwordCheck;
    if (!isEmailValid || !isPasswordValid || !isPasswordCheckValid) {
      setErrorMessages({
        emailError: isEmailValid ? '' : '이메일 형식으로 작성해 주세요.',
        passwordError: isPasswordValid ? '' : '8자 이상 입력해주세요.',
        passwordCheckError: isPasswordCheckValid
          ? ''
          : '비밀번호가 일치하지 않습니다.',
      });
      return;
    }
    try {
      await postUser({ email, password, type });
      setModal({
        isOpen: true,
        message: '가입이 완료되었습니다!',
      });
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
      });
    }
  }

  const handleModalConfirm = () => {
    if (modal.message === '가입이 완료되었습니다!') {
      setModal({ isOpen: false, message: '' });
      navigate('/login');
    } else {
      setModal({ isOpen: false, message: '' });
    }
  };

  return (
    <>
      <form
        className="mx-auto flex min-h-screen flex-col items-center justify-center px-12 py-90"
        onSubmit={handleSubmit}
      >
        <Link to="/" className="mb-40 h-45 w-full max-w-248">
          <img src={logo} />
        </Link>
        <div className="flex w-full max-w-350 flex-col gap-28">
          <Input
            type="email"
            name="email"
            label="이메일"
            error={errorMessages.emailError}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Input
            type="password"
            name="password"
            label="비밀번호"
            error={errorMessages.passwordError}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Input
            type="password"
            name="passwordCheck"
            label="비밀번호 확인"
            error={errorMessages.passwordCheckError}
            value={values.passwordCheck}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <fieldset>
            <legend className="mb-8 text-body1/26 font-regular text-black">
              회원 유형
            </legend>
            <div className="flex gap-16">
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
                className={`flex flex-1 cursor-pointer items-center justify-center gap-9 rounded-full border py-13 text-body2/22 ${
                  values.type === 'employee'
                    ? 'border-primary bg-white'
                    : 'border-gray-30'
                }`}
              >
                <img
                  src={values.type === 'employee' ? checked : not_checked}
                  className="size-20"
                />
                알바님
              </label>

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
                className={`flex flex-1 cursor-pointer items-center justify-center gap-9 rounded-full border py-13 text-body2/22 ${
                  values.type === 'employer'
                    ? 'border-primary bg-white'
                    : 'border-gray-30'
                }`}
              >
                <img
                  src={values.type === 'employer' ? checked : not_checked}
                  className="size-20"
                />
                사장님
              </label>
            </div>
          </fieldset>
          <Button type="submit" disabled={!isFormValid} className="w-full">
            가입하기
          </Button>
        </div>
        <p className="mt-16">
          이미 가입하셨나요?{' '}
          <Link to="/login" className="text-[#5534DA] underline">
            로그인하기
          </Link>
        </p>
      </form>

      {modal.isOpen && (
        <Modal onButtonClick={handleModalConfirm}>{modal.message}</Modal>
      )}
    </>
  );
}
