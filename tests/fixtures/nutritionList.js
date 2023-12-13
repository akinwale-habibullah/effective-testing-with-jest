const nutritionList = [
  [
    {
      "name": "pea",
      "calories": 85.1,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 5.4,
      "sodium_mg": 3,
      "potassium_mg": 115,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 15.5,
      "fiber_g": 5.6,
      "sugar_g": 5.9
    },
    {
      "name": "pasta",
      "calories": 156,
      "serving_size_g": 100,
      "fat_total_g": 0.9,
      "fat_saturated_g": 0.2,
      "protein_g": 5.7,
      "sodium_mg": 1,
      "potassium_mg": 58,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 31.3,
      "fiber_g": 1.8,
      "sugar_g": 0.6
    }
  ],
  [
    {
      "name": "cream sauce",
      "calories": 142.2,
      "serving_size_g": 100,
      "fat_total_g": 10.7,
      "fat_saturated_g": 6.6,
      "protein_g": 3.3,
      "sodium_mg": 98,
      "potassium_mg": 78,
      "cholesterol_mg": 30,
      "carbohydrates_total_g": 8.3,
      "fiber_g": 0.1,
      "sugar_g": 4.3
    },
    {
      "name": "angel hair pasta",
      "calories": 147.5,
      "serving_size_g": 100,
      "fat_total_g": 0.6,
      "fat_saturated_g": 0.1,
      "protein_g": 5.3,
      "sodium_mg": 4,
      "potassium_mg": 77,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 30.1,
      "fiber_g": 1.3,
      "sugar_g": 1.1
    }
  ],
  [
    {
      "name": "pasta",
      "calories": 156,
      "serving_size_g": 100,
      "fat_total_g": 0.9,
      "fat_saturated_g": 0.2,
      "protein_g": 5.7,
      "sodium_mg": 1,
      "potassium_mg": 58,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 31.3,
      "fiber_g": 1.8,
      "sugar_g": 0.6
    },
    {
      "name": "wild mushrooms",
      "calories": 30.2,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 2,
      "sodium_mg": 0,
      "potassium_mg": 74,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 7,
      "fiber_g": 2.7,
      "sugar_g": 2.1
    }
  ],
  [
    {
      "name": "fresh pasta",
      "calories": 128.2,
      "serving_size_g": 100,
      "fat_total_g": 1.1,
      "fat_saturated_g": 0.2,
      "protein_g": 5.1,
      "sodium_mg": 5,
      "potassium_mg": 63,
      "cholesterol_mg": 32,
      "carbohydrates_total_g": 25.1,
      "fiber_g": 0,
      "sugar_g": 0
    }
  ],
  [
    {
      "name": "fresh pasta",
      "calories": 128.2,
      "serving_size_g": 100,
      "fat_total_g": 1.1,
      "fat_saturated_g": 0.2,
      "protein_g": 5.1,
      "sodium_mg": 5,
      "potassium_mg": 63,
      "cholesterol_mg": 32,
      "carbohydrates_total_g": 25.1,
      "fiber_g": 0,
      "sugar_g": 0
    }
  ],
  [
    {
      "name": "fresh pasta",
      "calories": 128.2,
      "serving_size_g": 100,
      "fat_total_g": 1.1,
      "fat_saturated_g": 0.2,
      "protein_g": 5.1,
      "sodium_mg": 5,
      "potassium_mg": 63,
      "cholesterol_mg": 32,
      "carbohydrates_total_g": 25.1,
      "fiber_g": 0,
      "sugar_g": 0
    },
    {
      "name": "pasta primavera",
      "calories": 106.9,
      "serving_size_g": 100,
      "fat_total_g": 2.9,
      "fat_saturated_g": 1.6,
      "protein_g": 4.3,
      "sodium_mg": 287,
      "potassium_mg": 71,
      "cholesterol_mg": 6,
      "carbohydrates_total_g": 16,
      "fiber_g": 1.4,
      "sugar_g": 1.6
    }
  ],
  [
    {
      "name": "pesto pasta",
      "calories": 216.5,
      "serving_size_g": 100,
      "fat_total_g": 9.1,
      "fat_saturated_g": 1.7,
      "protein_g": 6.7,
      "sodium_mg": 84,
      "potassium_mg": 97,
      "cholesterol_mg": 3,
      "carbohydrates_total_g": 26.6,
      "fiber_g": 1.7,
      "sugar_g": 0.6
    }
  ],
  [
    {
      "name": "fresh tomato",
      "calories": 17.5,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 0.9,
      "sodium_mg": 4,
      "potassium_mg": 23,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 3.9,
      "fiber_g": 1.2,
      "sugar_g": 2.6
    },
    {
      "name": "basil",
      "calories": 24.4,
      "serving_size_g": 100,
      "fat_total_g": 0,
      "fat_saturated_g": 0,
      "protein_g": 4,
      "sodium_mg": 4,
      "potassium_mg": 56,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 2,
      "fiber_g": 2,
      "sugar_g": 0
    },
    {
      "name": "sauce",
      "calories": 48.8,
      "serving_size_g": 100,
      "fat_total_g": 1.6,
      "fat_saturated_g": 0.2,
      "protein_g": 1.4,
      "sodium_mg": 438,
      "potassium_mg": 34,
      "cholesterol_mg": 2,
      "carbohydrates_total_g": 7.5,
      "fiber_g": 1.8,
      "sugar_g": 5
    },
    {
      "name": "angel hair pasta",
      "calories": 147.5,
      "serving_size_g": 100,
      "fat_total_g": 0.6,
      "fat_saturated_g": 0.1,
      "protein_g": 5.3,
      "sodium_mg": 4,
      "potassium_mg": 77,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 30.1,
      "fiber_g": 1.3,
      "sugar_g": 1.1
    }
  ],
  [
    {
      "name": "tuna",
      "calories": 133.3,
      "serving_size_g": 100,
      "fat_total_g": 0.6,
      "fat_saturated_g": 0.2,
      "protein_g": 29.4,
      "sodium_mg": 54,
      "potassium_mg": 331,
      "cholesterol_mg": 46,
      "carbohydrates_total_g": 0,
      "fiber_g": 0,
      "sugar_g": 0
    },
    {
      "name": "tomatoes",
      "calories": 18.5,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 0.9,
      "sodium_mg": 5,
      "potassium_mg": 23,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 3.9,
      "fiber_g": 1.2,
      "sugar_g": 2.6
    },
    {
      "name": "pasta",
      "calories": 156,
      "serving_size_g": 100,
      "fat_total_g": 0.9,
      "fat_saturated_g": 0.2,
      "protein_g": 5.7,
      "sodium_mg": 1,
      "potassium_mg": 58,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 31.3,
      "fiber_g": 1.8,
      "sugar_g": 0.6
    }
  ],
  [
    {
      "name": "fried egg",
      "calories": 198.9,
      "serving_size_g": 100,
      "fat_total_g": 15.1,
      "fat_saturated_g": 4.3,
      "protein_g": 13.5,
      "sodium_mg": 208,
      "potassium_mg": 213,
      "cholesterol_mg": 393,
      "carbohydrates_total_g": 0.8,
      "fiber_g": 0,
      "sugar_g": 0.4
    },
    {
      "name": "red pepper",
      "calories": 27.8,
      "serving_size_g": 100,
      "fat_total_g": 0.2,
      "fat_saturated_g": 0,
      "protein_g": 0.9,
      "sodium_mg": 2,
      "potassium_mg": 17,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 6.8,
      "fiber_g": 1.2,
      "sugar_g": 4.4
    },
    {
      "name": "garlic",
      "calories": 144.8,
      "serving_size_g": 100,
      "fat_total_g": 0.7,
      "fat_saturated_g": 0,
      "protein_g": 6.4,
      "sodium_mg": 16,
      "potassium_mg": 153,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 32.5,
      "fiber_g": 2,
      "sugar_g": 1
    },
    {
      "name": "herb",
      "calories": 172.7,
      "serving_size_g": 100,
      "fat_total_g": 4.1,
      "fat_saturated_g": 1.1,
      "protein_g": 13.2,
      "sodium_mg": 127,
      "potassium_mg": 214,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 32.9,
      "fiber_g": 14.5,
      "sugar_g": 2.9
    },
    {
      "name": "pasta",
      "calories": 156,
      "serving_size_g": 100,
      "fat_total_g": 0.9,
      "fat_saturated_g": 0.2,
      "protein_g": 5.7,
      "sodium_mg": 1,
      "potassium_mg": 58,
      "cholesterol_mg": 0,
      "carbohydrates_total_g": 31.3,
      "fiber_g": 1.8,
      "sugar_g": 0.6
    }
  ]
]

module.exports = nutritionList;
