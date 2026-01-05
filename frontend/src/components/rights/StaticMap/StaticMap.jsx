import React from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'

// 验证并清理坐标数据
const validateAndCleanCoordinates = (coords) => {
  if (!Array.isArray(coords) || coords.length !== 2) return null
  const [lng, lat] = coords
  const cleanLng = parseFloat(lng)
  const cleanLat = parseFloat(lat)

  if (isNaN(cleanLng) || isNaN(cleanLat)) return null
  if (cleanLng < -180 || cleanLng > 180) return null
  if (cleanLat < -90 || cleanLat > 90) return null

  return [cleanLng, cleanLat]
}

export default function Amap({ isVisible = true }) {
  const dispatch = useDispatch()
  const selectedPosition = useSelector(
    (state) => state.map?.selectedPosition || null
  )
  const mapRef = useRef(null)
  const redDotMarkerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const aMapLibRef = useRef(null)
  const markersRef = useRef([])
  const polylineRef = useRef(null) // 添加polyline的ref
  // 记录由 GeoJSON 生成的折线，支持后续动态换色
  const geojsonPolylineOverlaysRef = useRef([])

  // 完整的位置数据
  const pos = [
    [112.876533, 28.233528], //旺龙路与青山路交叉口
    [112.873317, 28.228683], //旺龙路与岳麓西大道交叉口
    [112.883476, 28.231231], //尖山路与青山路交叉口
    [112.891312, 28.230781], //望青路与青山路交叉口
    [112.885194, 28.236462], //旺龙路与尖山路交叉口
    [112.891585, 28.225725], //望青路与岳麓西大道交叉口
  ]
    .map(validateAndCleanCoordinates)
    .filter(Boolean)

    .map((segment) => {
      const cleanPos = validateAndCleanCoordinates(segment.position)
      return cleanPos ? { ...segment, position: cleanPos } : null
    })
    .filter(Boolean)

  // 当地图变为可见时，触发resize
  useEffect(() => {
    if (isVisible && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.getSize()
        mapInstanceRef.current.resize()
      }, 100)
    }
  }, [isVisible])

  useEffect(() => {
    let map = null
    let isDestroyed = false

    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: 'd8ab80d5c581443cc3862879e172edff',
          version: '2.0',
          plugins: [
            'AMap.Polyline',
            'AMap.Marker',
            'AMap.Polygon',
            'AMap.Text',
            'AMap.Buildings',
            'AMap.ControlBar',
            'AMap.MoveAnimation',
            'AMap.TileLayer',
            'AMap.TileLayer.Satellite',
            'AMap.TileLayer.RoadNet',
            // 用于解析并渲染 GeoJSON
            'AMap.GeoJSON',
          ],
        })

        if (isDestroyed) return

        aMapLibRef.current = AMap

        // 验证中心点坐标
        const centerCoord = validateAndCleanCoordinates([112.883476, 28.231231])
        if (!centerCoord) {
          console.error('Invalid center coordinates')
          return
        }

        // 创建地图
        map = new AMap.Map('MapContainer', {
          resizeEnable: true,
          center: centerCoord,
          zoom: 15,
          viewMode: '3D',
          pitch: 40,
          rotation: 25,
          //   mapStyle: 'amap://styles/6b3bfb6d0d8ae9758a0beb4b5c900f3a', // 科技蓝主题
          buildingAnimation: true,
          // 增强光照效果
          light: {
            color: 'white', // 光源颜色
            intensity: 1.2, // 光照强度
            direction: [1, 0, -0.5], // 光照方向
          },
        })

        if (isDestroyed) {
          map?.destroy()
          return
        }

        mapInstanceRef.current = map
        //点击获取经纬度坐标
        mapRef.current = map
        map.on('click', (e) => {
          try {
            const lng = Number(e?.lnglat?.getLng?.())
            const lat = Number(e?.lnglat?.getLat?.())
            if (!isNaN(lng) && !isNaN(lat)) {
              console.log('Map clicked at coordinates (GCJ-02):', lng, lat)
            }
          } catch (err) {
            console.warn('处理地图点击坐标失败:', err)
          }
        })
        // 等待地图完全加载后再添加覆盖物
        map.on('complete', () => {
          if (isDestroyed) return

          try {
            // 3D建筑物增强
            const buildings = new AMap.Buildings({
              zIndex: 20,
              zooms: [16, 20],
              heightFactor: 2.5, // 增加高度比例
              color: 'rgb(26, 25, 25)', // 修改颜色
              color2: 'rgba(50, 50, 50, 1)', // 侧面颜色
              footColor: 'rgba(80, 80, 80, 1)', // 底部颜色
            })
            map.add(buildings)

            // 移除原本的动态路径线（仅保留 GeoJSON 路径）

            // 修正后的动画逻辑
            const initAnimations = () => {
              // 视角动画
              map.setStatus({
                animateEnable: true,
                center: centerCoord,
                zoom: 16,
                pitch: 55,
                rotation: -25,
                animationDuration: 2000,
              })
            }

            // 延迟执行动画
            setTimeout(initAnimations, 1000)

            // 加载并渲染 public/text.geojson（带后备解析与动态颜色）
            const loadGeoJSON = async () => {
              try {
                const resp = await fetch('text.geojson', { cache: 'no-store' })
                if (!resp.ok)
                  throw new Error(`加载 GeoJSON 失败: ${resp.status}`)
                const data = await resp.json()

                // 动态颜色解析函数
                // 优先 feature.properties.color；其次 window.mappolylinecolor
                // window.mappolylinecolor 可为：字符串/对象映射/函数
                const resolveColor = (feature) => {
                  const fallback = '#00E5FF'
                  const propColor = feature?.properties?.color
                  const conf = window?.mappolylinecolor
                  const fid = String(
                    feature?.properties?.id ?? feature?.id ?? ''
                  )

                  // 如果没有任何配置，则回退到 feature 自带颜色或默认色
                  if (!conf) return propColor || fallback

                  // 统一颜色
                  if (typeof conf === 'string') return conf

                  // 函数动态计算
                  if (typeof conf === 'function') {
                    try {
                      return conf(feature) || propColor || fallback
                    } catch {
                      return propColor || fallback
                    }
                  }

                  // 对象映射：支持
                  // 1) 直接按 id 映射 { '1': '#0f0' }
                  // 2) 逗号/竖线/空格分隔的 ids 键 {'1,2,3': '#0f0'} 或 {'7|8': 'red'}
                  // 3) 批量 { ids: [1,2,3], color: '#0f0' }
                  if (typeof conf === 'object') {
                    // 批量形式
                    if (Array.isArray(conf.ids) && conf.color) {
                      const idSet = new Set(conf.ids.map((x) => String(x)))
                      if (idSet.has(fid)) return conf.color
                    }
                    // 拆分键
                    for (const [key, val] of Object.entries(conf)) {
                      if (key === 'ids' || key === 'color') continue
                      if (
                        key.includes(',') ||
                        key.includes('|') ||
                        key.includes(' ')
                      ) {
                        const parts = key.split(/[\s,|]+/).filter(Boolean)
                        if (parts.includes(fid)) return val
                      }
                    }
                    // 直接精确匹配
                    if (conf[fid]) return conf[fid]
                  }

                  // 最后回退到 feature 自带颜色或默认
                  return propColor || fallback
                }

                // 清理上次的记录（通常仅初始化一次，这里稳妥处理）
                geojsonPolylineOverlaysRef.current = []

                let overlays = []
                if (aMapLibRef.current.GeoJSON) {
                  // 优先使用 AMap 原生解析器
                  const geojson = new aMapLibRef.current.GeoJSON({
                    geoJSON: data,
                    getMarker: (feature, lnglat) =>
                      new aMapLibRef.current.Marker({
                        position: lnglat,
                        offset: new aMapLibRef.current.Pixel(-10, -10),
                      }),
                    getPolyline: (feature, path) => {
                      const color = resolveColor(feature)
                      const poly = new aMapLibRef.current.Polyline({
                        path,
                        strokeColor: color,
                        strokeWeight: 8,
                        strokeOpacity: 0.9,
                      })
                      poly.setExtData?.({
                        featureId: feature?.properties?.id ?? feature?.id,
                        feature,
                      })
                      geojsonPolylineOverlaysRef.current.push(poly)
                      return poly
                    },
                    getPolygon: (feature, path) =>
                      new aMapLibRef.current.Polygon({
                        path,
                        fillColor: 'rgba(0, 229, 255, 0.25)',
                        strokeColor: '#00E5FF',
                        strokeWeight: 8,
                      }),
                  })
                  overlays = geojson.getOverlays?.() || []
                } else {
                  // 后备方案：手动解析常见类型
                  const AMapNS = aMapLibRef.current
                  const features = data?.features || []
                  features.forEach((f) => {
                    const geom = f.geometry || {}
                    const type = geom.type
                    const coords = geom.coordinates
                    if (!type || !coords) return
                    if (type === 'LineString') {
                      const path = coords.map(
                        ([lng, lat]) => new AMapNS.LngLat(lng, lat)
                      )
                      const color = resolveColor(f)
                      const poly = new AMapNS.Polyline({
                        path,
                        strokeColor: color,
                        strokeWeight: 8,
                        strokeOpacity: 0.9,
                      })
                      poly.setExtData?.({
                        featureId: f?.properties?.id ?? f?.id,
                        feature: f,
                      })
                      overlays.push(poly)
                      geojsonPolylineOverlaysRef.current.push(poly)
                    } else if (type === 'MultiLineString') {
                      coords.forEach((line) => {
                        const path = line.map(
                          ([lng, lat]) => new AMapNS.LngLat(lng, lat)
                        )
                        const color = resolveColor(f)
                        const poly = new AMapNS.Polyline({
                          path,
                          strokeColor: color,
                          strokeWeight: 8,
                          strokeOpacity: 0.9,
                        })
                        poly.setExtData?.({
                          featureId: f?.properties?.id ?? f?.id,
                          feature: f,
                        })
                        overlays.push(poly)
                        geojsonPolylineOverlaysRef.current.push(poly)
                      })
                    } else if (type === 'Polygon') {
                      const path =
                        coords[0]?.map(
                          ([lng, lat]) => new AMapNS.LngLat(lng, lat)
                        ) || []
                      overlays.push(
                        new AMapNS.Polygon({
                          path,
                          fillColor: 'rgba(0, 229, 255, 0.25)',
                          strokeColor: '#00E5FF',
                          strokeWeight: 2,
                        })
                      )
                    }
                  })
                }

                if (overlays.length) {
                  map.add(overlays)
                  // 记录用于卸载
                  markersRef.current.push(...overlays)

                  // 视野自适应到 geojson 覆盖物
                  const bounds = aMapLibRef.current.Bounds
                    ? overlays.reduce(
                        (b, ov) => b?.union?.(ov.getBounds?.()) || b,
                        null
                      )
                    : null
                  if (!bounds) {
                    map.setFitView(overlays, false, [50, 50, 50, 50])
                  }
                }
              } catch (err) {
                console.warn('加载或渲染 GeoJSON 出错:', err)
              }
            }

            // 暴露动态换色方法，示例：
            // window.updateGeoJSONColors({ '123': '#00ff00' })
            // window.updateGeoJSONColors((feature) => feature.properties.id === 123 ? 'green' : '#00E5FF')
            // window.updateGeoJSONColors('#FF00FF')
            window.updateGeoJSONColors = (colorConfig) => {
              if (colorConfig) window.mappolylinecolor = colorConfig
              const conf = window?.mappolylinecolor

              const computeColor = (feature) => {
                const fallback = '#00E5FF'
                const propColor = feature?.properties?.color
                const fid = String(feature?.properties?.id ?? feature?.id ?? '')

                if (!conf) return propColor || fallback
                if (typeof conf === 'string') return conf
                if (typeof conf === 'function') {
                  try {
                    return conf(feature) || propColor || fallback
                  } catch {
                    return propColor || fallback
                  }
                }
                if (typeof conf === 'object') {
                  if (Array.isArray(conf.ids) && conf.color) {
                    const idSet = new Set(conf.ids.map((x) => String(x)))
                    if (idSet.has(fid)) return conf.color
                  }
                  for (const [key, val] of Object.entries(conf)) {
                    if (key === 'ids' || key === 'color') continue
                    if (
                      key.includes(',') ||
                      key.includes('|') ||
                      key.includes(' ')
                    ) {
                      const parts = key.split(/[\s,|]+/).filter(Boolean)
                      if (parts.includes(fid)) return val
                    }
                  }
                  if (conf[fid]) return conf[fid]
                }
                return propColor || fallback
              }

              geojsonPolylineOverlaysRef.current.forEach((poly) => {
                const ext = poly.getExtData?.() || {}
                const feature = ext.feature
                const color = computeColor(feature)
                poly.setOptions?.({ strokeColor: color })
              })
            }

            // 地图加载后尝试加载 geojson
            loadGeoJSON()
          } catch (error) {
            console.error('地图初始化过程中出错:', error)
          }
        })

        // 添加错误处理
        map.on('error', (error) => {
          console.error('地图错误:', error)
        })
      } catch (error) {
        console.error('AMap 加载失败:', error)
      }
    }

    initMap()

    return () => {
      isDestroyed = true

      // 清理所有标记
      if (markersRef.current.length > 0) {
        try {
          if (
            mapInstanceRef.current &&
            typeof mapInstanceRef.current.remove === 'function'
          ) {
            // 过滤掉已经被移除的对象
            const overlays = markersRef.current.filter(Boolean)
            if (overlays.length) mapInstanceRef.current.remove(overlays)
          }
        } catch (error) {
          console.warn('批量移除覆盖物时出错:', error)
          // 回退逐个移除
          markersRef.current.forEach((ov) => {
            try {
              mapInstanceRef.current?.remove?.(ov)
            } catch (_) {}
          })
        }
        markersRef.current = []
      }

      // 清理polyline引用
      polylineRef.current = null

      // 销毁地图
      if (map && typeof map.destroy === 'function') {
        try {
          map.destroy()
        } catch (error) {
          console.warn('销毁地图时出错:', error)
        }
      }

      mapInstanceRef.current = null
      aMapLibRef.current = null
      // 清理全局方法
      if (window.updateGeoJSONColors) {
        try {
          delete window.updateGeoJSONColors
        } catch (_) {
          window.updateGeoJSONColors = undefined
        }
      }
    }
  }, [])

  return (
    <div className={styles.mapContainer}>
      {/* 可以取消注释添加图例 */}
      <div className={styles.title}>
        <span>区域3D地图</span>
      </div>
      <div
        id='MapContainer'
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,255,255,0.2)',
          background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
        }}
      />
    </div>
  )
}
