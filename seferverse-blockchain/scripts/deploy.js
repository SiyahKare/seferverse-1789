const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("MyContract");
  
  // deploy işlemi
  const contract = await ContractFactory.deploy();

  // ethers v6 -> waitForDeployment()
  await contract.waitForDeployment();

  console.log(`✅ Contract deployed to: ${await contract.getAddress()}`);
}

// Runner
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// Bu script, MyContract adlı bir akıllı sözleşmeyi deploy etmek için kullanılacak
// Hardhat'ın ethers kütüphanesini kullanarak sözleşme fabrikasını alır
// deploy işlemi gerçekleştirilir ve sözleşmenin adresi konsola yazdırılır
// Eğer bir hata oluşursa, hata konsola yazdırılır ve process exit kodu 1 olarak ayarlanır
// Bu, deploy işleminin başarılı bir şekilde tamamlanıp tamamlanmadığını kontrol etmek için kullanılır
// Ayrıca, ethers v6 ile uyumlu olarak waitForDeployment() metodu kullanılır
// Bu, sözleşmenin tam olarak deploy edildiğından emin olmak için önemlidir
// Sözleşme adresi, deploy işlemi tamamlandığında konsola yazdırılır
// Bu adres, sözleşmeye erişim için kullanılabilir          