
interface LoadingSpinnerProps {
    size?: "xs" | "sm" | "md" | "lg" | 'xl';
}

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
    const sizeClass = `loading-${size}`;

    return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;