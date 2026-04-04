import FinanceLottie from '../Animations/FinanceLottie';

const BRAND_ICON_LOTTIE_SRC =
  'https://lottie.host/51128661-4672-4650-b6a3-aecbd20751f7/WEwHq9bM5k.lottie';

const BrandIcon = ({ className = '' }) => (
  <FinanceLottie
    src={BRAND_ICON_LOTTIE_SRC}
    className={`h-full w-full ${className}`.trim()}
    speed={1.05}
  />
);

export default BrandIcon;
