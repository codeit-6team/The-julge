import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postToken } from '@/api/userApi';
import { AuthContext } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import logo from '@/assets/images/logo.svg';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    emailError: '',
    passwordError: '',
  });
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });

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
      }
      return newErrors;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8;

    if (!isEmailValid || !isPasswordValid) {
      setErrorMessages({
        emailError: isEmailValid ? '' : '이메일 형식으로 작성해 주세요.',
        passwordError: isPasswordValid ? '' : '8자 이상 입력해주세요.',
      });
      return;
    }
    try {
      const userInfo = await postToken({ email, password });
      login(
        userInfo.item.token,
        userInfo.item.user.item.type,
        userInfo.item.user.item.id,
      );
      navigate('/');
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
      });
    }
  }

  const handleModalConfirm = () => {
    setModal({ isOpen: false, message: '' });
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
          <Button type="submit" className="w-full">
            로그인 하기
          </Button>
        </div>
        <p className="mt-16">
          회원이 아니신가요?{' '}
          <Link to="/signup" className="text-[#5534DA] underline">
            회원가입하기
          </Link>
        </p>
      </form>

      {modal.isOpen && (
        <Modal onButtonClick={handleModalConfirm}>{modal.message}</Modal>
      )}
    </>
  );
}
