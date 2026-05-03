import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Field names match the backend
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    company_address: '',
    uen: '',
    contact_number: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);


    // remove confirmPassword before sending to backend
    const { confirmPassword, ...payload } = formData;

    const result = await signup(payload);

    setIsLoading(false);

    if (result && result.success) {
      toast.success('Account created successfully!');
      navigate('/home');
    } else {
      toast.error(result?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-green-800 mb-2">StayFresh</h1>
        <p className="text-gray-500 mb-6">Create your business account</p>

        <form onSubmit={handleSubmit}>
          <Field
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Field
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange} />
          <Field
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Field
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
          <Field
            label="Company Address"
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
          />
          <Field
            label="UEN" name="uen"
            value={formData.uen}
            onChange={handleChange}
          />
          <Field
            label="Contact Number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
          />

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md disabled:opacity-50 mt-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// function to keep the fields a bit cleaner
const Field = ({ label, type = 'text', name, value, onChange }) => {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
        type={type}
        name={name} // allows event.target.name to work
        required
        value={value}
        onChange={onChange} // Pass shared handleChange function here
      />
    </label>
  );
}

export default SignUp;