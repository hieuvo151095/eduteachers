'use client'

import { useState } from 'react'
import { MOCK_CLASSES, MOCK_FOOD_MENUS } from '@/lib/mock-data'
import type { Ingredient, FoodMenu } from '@/lib/mock-data'
import { FoodMenuScreen } from './food-menu-screen'
import { ClassSwitcher } from './class-switcher'
import { IngredientListModal } from './ingredient-list-modal'
import { IngredientDetailsModal } from './ingredient-details-modal'
import { DateCarousel } from './date-carousel'

export function ThucDonLopScreen() {
  const [selectedClass, setSelectedClass] = useState('class-7') // Lớp 6A2
  const [selectedDate, setSelectedDate] = useState('30/06/2026')
  const [showClassSwitcher, setShowClassSwitcher] = useState(false)
  const [selectedFood, setSelectedFood] = useState<any | null>(null)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [showIngredientList, setShowIngredientList] = useState(false)
  const [showIngredientDetails, setShowIngredientDetails] = useState(false)

  const classMenus = MOCK_FOOD_MENUS[selectedClass] || {}
  const currentMenu: FoodMenu | undefined = classMenus[selectedDate]
  const selectedClassName = MOCK_CLASSES.find(c => c.id === selectedClass)?.name || ''

  const handleFoodClick = (food: any) => {
    setSelectedFood(food)
    setShowIngredientList(true)
  }

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setShowIngredientList(false)
    setShowIngredientDetails(true)
  }

  const handleBackFromDetails = () => {
    setShowIngredientDetails(false)
    setShowIngredientList(true)
  }

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <FoodMenuScreen
        className={selectedClassName}
        selectedDate={selectedDate}
        currentMenu={currentMenu}
        onClassSwitch={() => setShowClassSwitcher(true)}
        onFoodClick={handleFoodClick}
      />

      <DateCarousel selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {showClassSwitcher && (
        <ClassSwitcher
          selectedClass={selectedClass}
          classes={MOCK_CLASSES}
          onSelect={(classId) => {
            setSelectedClass(classId)
            setShowClassSwitcher(false)
          }}
          onClose={() => setShowClassSwitcher(false)}
        />
      )}

      {showIngredientList && selectedFood && (
        <IngredientListModal
          food={selectedFood}
          onIngredientClick={handleIngredientClick}
          onClose={() => {
            setShowIngredientList(false)
            setSelectedFood(null)
          }}
        />
      )}

      {showIngredientDetails && selectedIngredient && (
        <IngredientDetailsModal
          ingredient={selectedIngredient}
          onBack={handleBackFromDetails}
        />
      )}
    </div>
  )
}
