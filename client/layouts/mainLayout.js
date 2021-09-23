import Navigation from "../components/common/navigation/navigation";
// import Footer from "../components/common/footer/footer";

export default function mainLayout(page) {
  return (
    <>
      <Navigation />
      {page}
      {/*<Footer />*/}
    </>
  );
}
