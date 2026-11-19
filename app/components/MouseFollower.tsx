"use client"
import { useEffect, useRef } from "react"
import styles from "./mouseFollowerStyles.module.css"

export function MouseFollower(){

    const div = useRef<HTMLDivElement|null>(null)
    const rafId = useRef<number|null>(null)
    const pos = useRef({x:0, y:0})
    
    useEffect(()=>{
        const handleMouseMove=(e:MouseEvent)=>{
            pos.current.x = e.clientX
            pos.current.y = e.clientY
        }
        window.addEventListener('mousemove',handleMouseMove)
        return()=>window.removeEventListener('mousemove',handleMouseMove)
    },[])
    
    useEffect(()=>{
        if(!div.current)return

        let transform = {x:0,y:0}
        let before:number|null = null

        const step=(now:number)=>{
            if(before === null){
                before = now
            }
            const dt = (now - before) / 1000
            before = now
            const factor = 1 - Math.exp(-7*dt)
            
            //lerp
            transform.x += (pos.current.x - transform.x)*factor
            transform.y += (pos.current.y - transform.y)*factor

            div.current!.style.transform = `translate(${transform.x}px, ${transform.y}px)`
            
            rafId.current = requestAnimationFrame(step)
        }

        rafId.current = requestAnimationFrame(step)

    },[])
    
    return(
        <div 
        ref={div}
        className={styles.div}
        />
    )
}