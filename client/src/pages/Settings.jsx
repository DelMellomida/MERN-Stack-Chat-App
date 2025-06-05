import { useThemeStore } from "../store/useThemeStore";

const Settings = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const testThemes = ["light", "dark"];

  return (
    <div className="p-8 min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 mt-20">Settings</h1>

      {/* Appearance Settings */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Appearance</h2>

        {/* <div className="mb-4">
          <button onClick={toggleTheme} className="btn btn-primary">
            Toggle Theme (Current: {theme})
          </button>
        </div> */}

        <div className="flex space-x-2 mb-6">
          {testThemes.map((testTheme) => (
            <button
              key={testTheme}
              onClick={() => setTheme(testTheme)}
              className={`btn ${theme === testTheme ? 'btn-accent' : 'btn-outline'}`}
            >
              {testTheme.charAt(0).toUpperCase() + testTheme.slice(1)}
            </button>
          ))}
        </div>

        {/* Visual Test Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-200 text-base-content shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="font-bold">Base-200</h3>
              <p>Example of bg-base-200</p>
            </div>
          </div>
          {/* <div className="card bg-primary text-primary-content shadow-lg border border-primary">
            <div className="card-body">
              <h3 className="font-bold">Primary</h3>
              <p>Example of bg-primary</p>
            </div>
          </div>
          <div className="card bg-secondary text-secondary-content shadow-lg border border-secondary">
            <div className="card-body">
              <h3 className="font-bold">Secondary</h3>
              <p>Example of bg-secondary</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Example Account Settings Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-bold mb-2">Profile</h3>
            <p>Update your profile details and manage privacy settings.</p>
            {/* You could add a link or button here */}
          </div>
          <div className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-bold mb-2">Security</h3>
            <p>Manage your password, enable two-factor authentication, and more.</p>
          </div>
        </div>
      </section>

      {/* Notifications Settings Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <div className="p-4 border border-base-300 rounded-lg">
          <p>Set your notification preferences including email and push notifications settings.</p>
          {/* Example: Add toggle switches for different notifications */}
        </div>
      </section>
    </div>
  );
};

export default Settings;