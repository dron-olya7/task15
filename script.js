'use strict';
// #1

let persons = [];
let cities = [];
let specializations = [];

Promise.all(
   [
      fetch('person.json'),
      fetch('cities.json'),
      fetch('specializations.json'),
   ]
).then(async ([personsResponse, citiesResponse, specializationsResponce]) => {
   const personsJson = await personsResponse.json();
   const citiesJson = await citiesResponse.json();
   const specializationsJson = await specializationsResponce.json();
   return [personsJson, citiesJson, specializationsJson]
})
   .then(response => {
      persons = response[0];
      cities = response[1];
      specializations = response[2];

      processData();
   })


// #2

function getInfo() {
   return `${this.firstName} ${this.lastName}, ${this.city} `
}


function processData() {
   let desiner = specializations.find(item =>
      item.name.toLowerCase() === 'designer');

   let developerFront = specializations.find(item =>
      item.name.toLowerCase() === 'frontend'
   );
   let developerBack = specializations.find(item => item.name.toLowerCase() === 'backend');
   let firstReactDeveloperFound = false;
   let allAdults = true;


   persons.forEach((person) => {

      let personalData = person.personal;
      let personSkills = person.skills;
      let personCity = cities.find(city =>
         city.id === personalData.locationId);
      if (personCity) {
         personalData.city = personCity.name;
      }

      let personData = getInfo.call(personalData);
      // task 2
      console.log(personData);
      // task 3
      let figmaSkill = personSkills.find(skill =>
         skill.name.toLowerCase() === 'figma');
      // отбор только дизайнеры figma
      if (figmaSkill && personSkills && personalData.specializationId === desiner.id) {
         let figmaDesiners = getInfo.call(personalData);
         // task3
         console.log('Дизайнеры Figma :', figmaDesiners);
      }
      //task4
      let reactSkill = personSkills.find(skill => skill.name.toLowerCase() === 'react');
      if (!firstReactDeveloperFound && ((reactSkill && personalData.specializationId === developerFront.id) || (reactSkill && personalData.specializationId === developerBack.id))) {
         let firstReactDeveloper = getInfo.call(personalData);
         firstReactDeveloperFound = true;

         console.log('Разработчик React: ', firstReactDeveloper);
      }
   })


   // Task 5
   persons.forEach(person => {

      let personalData = person.personal;
      let isPersonAdult = isAdultPerson.call(personalData);
      if (!isPersonAdult) {
         allAdults = false;
         console.log('Не является совершеннолетним:', getInfo.call(personalData));
      }

   })
   if (allAdults) {

      console.log('Все совершеннолетние');
   }

   // function task5
   function isAdultPerson() {
      const birthday = this.birthday;
      const [day, month, year] = birthday.split('.');
      const birthDate = new Date(year, month - 1, day);
      let currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      let monthDiff = currentDate.getMonth() - birthDate.getMonth();
      let dayDiff = currentDate.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
         age--;
      }


      return age >= 18;
   }





   //task6 применена деструктуризация
   let moscowCity = cities.find(city =>
      city.name.toLowerCase() === 'москва');

   let backDevelopersMoscow = persons.filter(person => {
      const { personal: { specializationId, locationId } } = person;
      return specializationId === developerBack.id && locationId === moscowCity.id
   });
   let developersSalaryRequest = [];

   backDevelopersMoscow.forEach(backDeveloper => {

      let employmentType = backDeveloper.request.find(item => item.name.toLowerCase() === 'тип занятости');
      if (employmentType && employmentType.value.toLowerCase() === 'полная') {
         let backDeveloperFromMoscowForEmploymentTypeFull = getInfo.call(backDeveloper.personal);
         let salaryExpectations = backDeveloper.request.find(item => item.name.toLowerCase() === 'зарплата');
         if (salaryExpectations && typeof salaryExpectations.value === 'number') {
            developersSalaryRequest.push({
               person: backDeveloperFromMoscowForEmploymentTypeFull,
               specialization: developerBack.name,
               salaryRequest: salaryExpectations.value,
            });
         }
      }
   });
   developersSalaryRequest.sort(function (a, b) {
      return a.salaryRequest - b.salaryRequest;
   });
   developersSalaryRequest.forEach(developer => {
      console.log(developer.person, developer.specialization, '-Зарплатные ожидания: ', developer.salaryRequest);
   });


   // Task 7
   let desinersHighQuality = persons.filter(person => {
      const { personal: { specializationId }, skills } = person;
      const isDesiner = specializationId === desiner.id && person.skills.length > 0;
      if (isDesiner) {
         const photoshopSkill = skills.some(skill => skill.name.toLowerCase() === 'photoshop' && skill.level >= 6);
         const figmaSkill = skills.some(skill => skill.name.toLowerCase() === 'figma' && skill.level >= 6);
         return photoshopSkill && figmaSkill;
      }
      return false;
   });
   // console.log(desinersHighQuality);
   desinersHighQuality.forEach(desiner => {
      let personalData = getInfo.call(desiner.personal)
      console.log('Самые крутые дизайнеры: ', personalData);
   })

   //Task 8
   function isBestSkillPerson(skillName) {
      const filterPersons = persons.filter(person => {
         return person.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase());
      });
      if (filterPersons.length === 0) {
         return null;
      }
      return filterPersons.reduce((bestPerson, currentPerson) => {
         let bestLevel = bestPerson.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase()).level;
         let currentLevel = currentPerson.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase()).level;
         return bestLevel > currentLevel ? bestPerson : currentPerson;
      });
   };

   const bestFigmaDesigner = isBestSkillPerson('Figma');
   const bestFrontendDeveloperAngular = isBestSkillPerson('angular');
   const bestBackDeveloperGo = isBestSkillPerson('go');

   const bestFigmaDesignerData = getInfo.call(bestFigmaDesigner.personal);
   const bestFrontendDeveloperAngularData = getInfo.call(bestFrontendDeveloperAngular.personal);
   const bestBackDeveloperGoData = getInfo.call(bestBackDeveloperGo.personal);

   console.log('Команда для разработки проекта: ', 'Дизайнер:', bestFigmaDesignerData, 'Frontend-разработчик:', bestFrontendDeveloperAngularData, 'backend-разработчик: ', bestBackDeveloperGoData)

}





