'use client'

import { useState } from 'react'
import {
  MOCK_CLASSES,
  MOCK_FOOD_MENUS,
  type ClassInfo,
  type FoodMenu,
  type Ingredient,
} from '@/lib/mock-data'
import { FoodMenuScreen } from './food-menu-screen'
import { ClassSwitcher } from './class-switcher'
import { DatePicker } from './date-picker'
import { IngredientDetails } from './ingredient-details'

export function ThucDonLopApp() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'classSwitch' | 'datePicker'>(
    'menu'
  )
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(MOCK_CLASSES[0])
  const [selectedDate, setSelectedDate] = useState<string>('30/06/2026')
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [showIngredientDetails, setShowIngredientDetails] = useState(false)

  const foodMenu: FoodMenu = MOCK_FOOD_MENUS[selectedClass.id] || MOCK_FOOD_MENUS['class-1']

  const handleClassSwitch = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo)
    setCurrentScreen('menu')
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setCurrentScreen('menu')
  }

  const handleShowIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setShowIngredientDetails(true)
  }

  const handleCloseIngredient = () => {
    setShowIngredientDetails(false)
    setSelectedIngredient(null)
  }

  return (
    <div className="relative flex h-screen w-full max-w-sm flex-col bg-white">
      {currentScreen === 'menu' && (
        <FoodMenuScreen
          selectedClass={selectedClass}
          foodMenu={foodMenu}
          selectedDate={selectedDate}
          onClassSwitch={() => setCurrentScreen('classSwitch')}
          onDateChange={() => setCurrentScreen('datePicker')}
          onIngredientClick={handleShowIngredient}
        />
      )}

      {currentScreen === 'classSwitch' && (
        <ClassSwitcher classes={MOCK_CLASSES} onSelect={handleClassSwitch} />
      )}

      {currentScreen === 'datePicker' && (
        <DatePicker onDateSelect={handleDateSelect} />
      )}

      {showIngredientDetails && selectedIngredient && (
        <IngredientDetails ingredient={selectedIngredient} onClose={handleCloseIngredient} />
      )}
    </div>
  )
}
