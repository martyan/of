import cover from './static/img/cover.jpg'
import cover2 from './static/img/cover2.jpg'
import cover3 from './static/img/cover3.jpg'
import cover4 from './static/img/cover4.jpg'
import cover5 from './static/img/cover5.jpg'
import cover6 from './static/img/cover6.jpg'

const quantity = {
    s: 0,
    m: 2,
    l: 4,
    xl: 3
}

const description = 'Oversized and long fitting summer crew neck sweat with high quality thick ribbing. Front & huge back summer city print. All Happi Collective items will not be restocked when sold out, this means we will always offer up new designs and the clothing you’ll buy will stay unique. New color options may be offered on our most popular styles.'

export const imgs = [
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_c.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_b.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_d.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_f.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_e.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/old-felony.appspot.com/o/products%2Fproduct_a.jpg?alt=media'
]

export const blogImgs = [
    cover,
    cover2,
    cover3,
    cover4,
    cover5,
    cover6
]

export const products = [
    {
        id: 'flower',
        type: 'tshirt',
        name: 'Flower tee',
        description,
        price: 420,
        img: imgs[0],
        gender: 'male',
        quantity
    },
    {
        id: 'girl',
        type: 'sweatshirt',
        name: 'Girl bleach',
        description,
        price: 590,
        img: imgs[1],
        gender: 'female',
        quantity
    },
    {
        id: 'other',
        type: 'tshirt',
        name: 'Other tee',
        description,
        price: 390,
        img: imgs[2],
        gender: 'male',
        quantity
    },
    {
        id: 'hippi',
        type: 'tshirt',
        name: 'Hippie tee',
        description,
        price: 590,
        img: imgs[3],
        gender: 'male',
        quantity
    },
    {
        id: 'palmas',
        type: 'tshirt',
        name: 'Las palmas tees',
        description,
        price: 420,
        img: imgs[4],
        gender: 'male',
        quantity
    },
    {
        id: 'whitey',
        type: 'sweatshirt',
        name: 'Whitey sweet',
        description,
        price: 590,
        img: imgs[5],
        gender: 'male',
        quantity
    }
]
