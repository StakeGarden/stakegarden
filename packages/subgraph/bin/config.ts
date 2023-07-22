export const config: Record<
  string,
  {
    stakeFactory: {
      address: string;
      startBlock: number;
    };
  }
> = {
  polygon: {
    stakeFactory: {
      address: "0x5BEBd2841FAaeCF9de2F1ebbA29C9573Fc38DEF0",
      startBlock: 45359346
    }
  },
  mainnet: {
    stakeFactory: {
      address: "0x161a76d2214685214AcE947EC7c6BfDFe6ab5376",
      startBlock: 17748235 // TODO: update this
    }
  }
};
