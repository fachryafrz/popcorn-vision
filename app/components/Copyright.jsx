const Copyright = () => {
  return (
    <p className="text-center p-2 bg-gray-900 text-sm cursor-default">
      Design by{" "}
      <a
        href="https://dribbble.com/iamehsan"
        target="_blank"
        className="text-[#ea4c89] font-medium transition-all"
      >
        Ehsan Gholampour
      </a>{" "}
      <br className={`xs:hidden`} />& Built by{" "}
      <a
        href="https://fachryafrz.vercel.app"
        target="_blank"
        className="text-[#ea4c89] font-medium transition-all"
      >
        Fachry Dwi Afriza
      </a>
    </p>
  );
};

export default Copyright;
