const Copyright = () => {
  return (
    <p className="cursor-default bg-gray-900 p-2 text-center text-sm">
      Design by{" "}
      <a
        href="https://dribbble.com/iamehsan"
        target="_blank"
        className="font-medium text-[#ea4c89] transition-all"
      >
        Ehsan Gholampour
      </a>{" "}
      <br className={`xs:hidden`} />& Built by{" "}
      <a
        href="https://fachryafrz.vercel.app"
        target="_blank"
        className="font-medium text-[#ea4c89] transition-all"
      >
        Fachry Dwi Afriza
      </a>
    </p>
  );
};

export default Copyright;
