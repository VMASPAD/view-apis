# View APIs

A React-based application for fetching, viewing, and editing JSON data from APIs. The app includes features like URL history, dark/light mode toggle, and a JSON viewer/editor.

## Features

- Fetch JSON data from APIs.
- View and edit JSON data with a built-in editor.
- URL history with clickable links for quick re-fetching.
- Dark and light mode toggle.
- Responsive and user-friendly UI.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd view-apis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter an API URL in the input field and click "Submit" to fetch data.
2. View the fetched JSON in the "Viewer" tab.
3. Edit the JSON in the "Editor" tab using the Monaco Editor.
4. Toggle between dark and light mode using the theme button.
5. Access previously fetched URLs from the URL history.

## Technologies Used

- **React**: For building the user interface.
- **Preact Hooks**: For state management.
- **Monaco Editor**: For JSON editing.
- **Tailwind CSS**: For styling.
- **Framer Motion**: For animations.
- **Sonner**: For toast notifications.

## License

This project is licensed under the MIT License.
